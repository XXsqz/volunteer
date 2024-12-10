//将时间转化为日常方式
export function parseTime(time: string) {
    let date = new Date(time);
    date.setHours(date.getHours() + 8); // 增加8小时
    let times = date.toISOString().split(/T|\./);
    return times[0] + " " + times[1];
}
//将类型转化为中文
export function parseCategory(category: string) {
    if(category==='MEDICAL') return '医疗';
    if(category==='CLEANUP') return '清理';
    if(category==='EXPLAIN') return '讲解';
    if(category==='LAYOUT') return '布置';
    if(category==='GUIDE') return '引导';
    if(category==='TEACHING') return '支教';
    return '其他';
}