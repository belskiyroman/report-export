var path = require('path');
var excelbuilder = require('msexcel-builder');
var normalizeUrl = require('normalizeurl');
var request = require('request');
var cheerio = require('cheerio');
var moment = require('moment');
var program = require('commander');
var schema = require('./schema');

program
  .version('0.0.1')
  .option('-h [], --host []', 'host')
  .option('-u [], --user []', 'user')
  .option('-o [], --out []', 'name of output file without extension')
  .parse(process.argv);

var host = program.H || program.host;
var fileName = program.O || program.out;
var user = program.U || program.user;
// var workbook = excelbuilder.createWorkbook('./', fileName + '.xlsx');

var year = moment().get('year');
var month = moment().get('month');
var startDate = moment([year, month, 1]);
var endDate = moment(startDate).endOf('month');
var reportPath = '/secure/ConfigureReport.jspa?';
var params = [
    'startDate=' + startDate.format('D/MMM/YY+'),
    'endDate=' + endDate.format('D/MMM/YY+'),
    'targetUser=' + user + '+',
    'targetGroup=',
    'excludeTargetGroup=',
    'projectRoleId=',
    'filterid=',
    'priority=',
    'monthView=true',
    'groupByField=',
    'moreFields=',
    'selectedProjectId=10000',
    'reportKey=jira-timesheet-plugin%3Areport+',
    'Next=Next'
];
var url = normalizeUrl( host + reportPath + params.join('&') );

request(url, function (error, response, body) {
    if (error) return console.log(error);
    if (response.statusCode != 200) return console.log('Server response code: ' + response.statusCode);
    
    var $ = cheerio.load(body);
    var tasks = $('.aui > :last-child td:nth-child(4) > a');
    console.log(body);
    console.log(tasks.length);

    // var sheet1 = workbook.createSheet('sheet1', 11, 35);
});