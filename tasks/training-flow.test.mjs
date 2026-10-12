import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const htmlPath = new URL('../明镜/1_产品原型/明镜产品原型.html', import.meta.url);
const html = readFileSync(htmlPath, 'utf8');
const dataStart = html.indexOf('const EXAMS = [');
const dataEnd = html.indexOf('function traineeFind(key){', dataStart);
const flowEnd = html.indexOf('/* ===== P41D 学员档案', dataEnd);
const taskStart = html.indexOf('function p41Pass(tid){');
const taskEnd = html.indexOf('function pageP41(){', taskStart);
assert.ok(dataStart >= 0 && dataEnd > dataStart && flowEnd > dataEnd && taskStart >= 0 && taskEnd > taskStart,
  'training helpers and score handler remain extractable from the prototype');

function trainingFixture(){
  const context = {
    ST: {p41:{who:'麦子',detailView:'tasks'},p42:{view:'queue',lastResult:null}},
    TASKS41: [
      {id:'t1',sname:'麦子',st:'done',evidence:'规则测验通过'},
      {id:'t2',sname:'麦子',st:'doing',evidence:'待补充'}
    ],
    messages: [], renders: 0, modalOpen: true, modalValue: '', evidenceValue: '', focused: false,
    location: {hash:'#P42'},
    document: {getElementById(id){
      if(id==='esc2') return {get value(){return context.modalValue;},focus(){context.focused=true;}};
      if(id==='p41Evidence') return {get value(){return context.evidenceValue;},focus(){context.focused=true;}};
      return null;
    }},
    toast(message){ context.messages.push(message); },
    render(){ context.renders++; },
    closeModal(){ context.modalOpen=false; },
    p42State(){ return context.ST.p42; },
    p41State(){ return context.ST.p41; },
    p41Tasks(name){ return context.TASKS41.filter(x=>x.sname===name); }
  };
  const code = html.slice(taskStart, taskEnd) + html.slice(dataStart, flowEnd)
    + '\n globalThis.api={EXAMS,examPending,scheduleRetake,canGraduateMaizi,examOutcomeText,weakPoint,saveExam,p41Pass,saveTaskEvidence};';
  vm.runInNewContext(code, context, {filename:'prototype-training-flow.js'});
  return {context, api:context.api};
}

test('retry scheduling creates exactly one linked attempt and removes the old retry from the queue', () => {
  const {api, context} = trainingFixture();
  const failed = api.EXAMS.find(x=>x.id==='e3b');
  assert.equal(api.examPending(failed), true);
  api.scheduleRetake(failed.id);
  assert.ok(failed.retakeId);
  const next = api.EXAMS.find(x=>x.id===failed.retakeId);
  assert.equal(next.st, 'wait');
  assert.equal(next.previousId, failed.id);
  assert.equal(api.examPending(failed), false);
  assert.equal(api.examPending(next), true);
  const count = api.EXAMS.length;
  api.scheduleRetake(failed.id);
  assert.equal(api.EXAMS.length, count);
  assert.equal(context.renders, 1);
});

test('graduation stays blocked until every learner task and assessment passes', () => {
  const {api, context} = trainingFixture();
  assert.equal(api.canGraduateMaizi(), false);
  context.TASKS41.forEach(x=>x.st='done');
  api.EXAMS.find(x=>x.id==='e1').st='wait';
  assert.equal(api.canGraduateMaizi(), false);
  api.EXAMS.filter(x=>x.sname==='麦子').forEach(x=>x.st='pass');
  assert.equal(api.canGraduateMaizi(), true);
});

test('waived assessments never appear as both unscored and passed', () => {
  const {api} = trainingFixture();
  const waived=api.EXAMS.find(x=>x.try.startsWith('免修'));
  const pending=api.EXAMS.find(x=>x.st==='wait');
  const retry=api.EXAMS.find(x=>x.st==='retry');
  assert.equal(api.examOutcomeText(waived), '免修通过 · 无需评分');
  assert.equal(api.examOutcomeText(pending), '尚未评分');
  assert.equal(api.examOutcomeText(retry), '得分 74 分 · 未达 80 分');
  assert.equal((html.match(/examOutcomeText\(e\)/g)||[]).length, 4,
    'define one shared outcome helper and use it in P41D, P42 queue, and P42 history');
});

test('empty score, fractions and out-of-range scores remain in the modal without changing the exam', () => {
  const {api, context} = trainingFixture();
  const exam = api.EXAMS.find(x=>x.id==='e3');
  for (const value of ['', '79.5', '101']) {
    context.modalValue=value;
    api.saveExam(exam.id);
    assert.equal(context.modalOpen, true);
    assert.equal(exam.score, null);
  }
  assert.equal(context.focused, true);
  assert.equal(context.messages.length, 3);
  assert.equal(context.renders, 0);
});

test('valid score creates a durable pass or retry result and keeps the correct learner context', () => {
  const {api, context} = trainingFixture();
  const exam=api.EXAMS.find(x=>x.id==='e3');
  context.modalValue='80';
  api.saveExam(exam.id);
  assert.equal(exam.st, 'pass');
  assert.equal(context.ST.p42.lastResult.sid, exam.sid);
  assert.equal(context.ST.p42.lastResult.score, 80);
  assert.equal(context.modalOpen, false);

  const failed=api.EXAMS.find(x=>x.id==='e3b');
  context.modalOpen=true;
  context.modalValue='79';
  api.saveExam(failed.id);
  assert.equal(failed.st, 'retry');
  assert.equal(context.ST.p42.lastResult.st, 'retry');
  assert.equal(context.ST.p42.lastResult.examId, failed.id);
});

test('task evidence is required before acceptance and can be saved from the learner record', () => {
  const {api, context} = trainingFixture();
  const task=context.TASKS41.find(x=>x.id==='t2');
  task.evidence='';
  api.p41Pass(task.id);
  assert.equal(task.st, 'doing');
  assert.equal(context.messages.at(-1), '请先补充验收证据');
  context.evidenceValue='整场演练已完成，培训师现场验收通过';
  api.saveTaskEvidence(task.id);
  assert.equal(task.evidence, context.evidenceValue);
  assert.equal(context.modalOpen, false);
  assert.equal(task.st, 'doing');
  api.p41Pass(task.id);
  assert.equal(task.st, 'done');
});

test('saving a learner conversation returns to that learner’s communication section', () => {
  const streamer={id:'lizi',name:'栗子',comms:[],handoffs:[]};
  const context={
    ST:{role:'peixun',p22:{tab:'overview'},p41:{detailView:'tasks'}},
    VISITS:[], VISITHIST:[],
    location:{hash:'#P41D/lizi'},
    document:{getElementById(id){
      if(id==='ctx') return {value:'补考已通过，后续完成规则测验。'};
      if(id==='cway') return {value:'微信'};
      return null;
    }},
    closeModal(){}, toast(){}, render(){},
    go(route){context.location.hash='#'+route;context.lastRoute=route;},
    p41State(){return context.ST.p41;},
    byId(id){return id==='lizi'?streamer:null;},
    detailOf(value){return value;}
  };
  const start=html.indexOf('function sendComm(id, returnTo=null){');
  const end=html.indexOf('/* ---------- 提示 ---------- */',start);
  assert.ok(start>=0&&end>start,'shared conversation handler remains extractable');
  vm.runInNewContext(html.slice(start,end)+'\n globalThis.saveConversation=sendComm;',context,{filename:'prototype-conversation-flow.js'});

  context.saveConversation('lizi','P41D/lizi');

  assert.equal(context.location.hash,'#P41D/lizi');
  assert.equal(context.ST.p41.detailView,'history');
  assert.equal(streamer.comms[0].text,'补考已通过，后续完成规则测验。');
  assert.equal(context.lastRoute,'P41D/lizi');
});
