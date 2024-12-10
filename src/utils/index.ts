//将时间转化为日常方式
export function parseTime(time: string) {
    let date = new Date(time);
    date.setHours(date.getHours() + 8); // 增加8小时
    let times = date.toISOString().split(/T|\./);
    return times[0] + " " + times[1];
}