// Throwaway scan: flag files containing common Simplified-only Han characters.
import fs from "node:fs";
import path from "node:path";

const SIMP = Array.from(
  "们这来个东西时间问题应该开关闭见话语说读写动车长发现实让点击爱国养护传统计划过运营业务归属准备视频软件信息屏幕默认网络优显专丰为乐书买卖产价众优伙会传伤体余佣"
);

const files = [];
function walk(d) {
  for (const f of fs.readdirSync(d)) {
    const fp = path.join(d, f);
    const s = fs.statSync(fp);
    if (s.isDirectory()) walk(fp);
    else if (/\.(json|tsx|ts)$/.test(f)) files.push(fp);
  }
}
walk("public/data");
walk("src");

const hits = {};
for (const fp of files) {
  const t = fs.readFileSync(fp, "utf8");
  for (const c of SIMP) if (t.includes(c)) (hits[fp] ||= new Set()).add(c);
}
for (const k of Object.keys(hits)) console.log(k, "->", [...hits[k]].join(" "));
console.log("files flagged:", Object.keys(hits).length);
