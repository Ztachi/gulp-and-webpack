const repea = require('widget/getRepeat');
require.ensure(['widget/getRepeat'],function(require){
    
},'a');
document.querySelector('#text').innerText = '重装机兵1地图'+repea('3');