const content = `<num> 日美國總統<per0>與英國首相<per1>舉行雙邊會談，兩人會後發布聯合聲明，<per0>表示支持<org0>...`;
const reG = /<\w*>/g;
const re = /(<\w*>)/;
let tags = content.match(reG);
console.log(tags);

let tagSet = new Set(tags);
console.log(tagSet);
const arrFromSet = Array.from(tagSet);
let temp = content.split(re);
let tagVariables = {
    num: 155,
    per0: "Jay",
    org0: "WHO",
    per1: "BCP",
}
// let num = 155;
// let per0 = "Jay";
// let org0 = "WHO";
// let per1 = "BCP";
for (let i = 0; i < temp.length; ++i) {
    if (tagSet.has(temp[i])) {
        temp[i] = tagVariables[temp[i].substring(1, temp[i].length - 1)];
    }
}
console.log(temp);

for (const tag in tagVariables) {
    console.log(`tag: ${tag}, value: ${tagVariables[tag]}`)
}

