const repea = require('widget/getRepeat');

document.querySelector('#btn').onclick=()=>{
    require.ensure([],function(require){
        require('./a');
    },'a');
}

document.querySelector('#text').innerText = '重装机兵1地图'+repea('3');
$.ajax({
    url:'/svg/svg.svg',
    success:(d)=>console.log(d)
})