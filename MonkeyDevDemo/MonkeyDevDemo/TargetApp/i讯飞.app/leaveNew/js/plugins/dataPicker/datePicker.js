/**
 *
 *
 *
 * 2018-5-30
 *
 */
;
(function(window, $$, undefined) {
    
    // 时间控件 / Framework7 picker
    var pickerDate = function(input,dataType,date) {
        
        // 当前时间
        var today;
        if(!date || date=='null' || date=='undefined'){
            today= new Date()
        }else{
            var dateArr=date.split(' ');
            if(dateArr,length==1){
                var date=[00,00]
            }else{
                var date=dateArr[0].split('-'),time=dateArr[1].split(':');
            }
            today= new Date(date[0],date[1]-1,date[2],time[0],time[1])
        }

        var pickerInline = app.picker.create({
            inputEl: input,
            toolbar: true,
            rotateEffect: true,
            renderToolbar: function() {
                return '<div class="toolbar">' + '<div class="toolbar-inner">' + '<div class="left">' + '</div>' + '<div class="right">' + '<a href="#" class="link sheet-close popover-close">确定</a>' + '</div>' + '</div>' + '</div>';
            },
            value: [
                today.getFullYear(),
                today.getMonth() + 1,
                today.getDate(),
                today.getHours() < 10 ? '0' + today.getHours() : today.getHours(),
                today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes()
            ],
            formatValue: function(values, displayValues) {
                if(dataType=='yymmdd'){
                    return values[0] + '-' + parseInt(values[1]) + '-' + values[2];
                }else{
                    return values[0] + '-' + (parseInt(values[1])<10?'0'+parseInt(values[1]):parseInt(values[1])) + '-' + (parseInt(values[2])<10?'0'+parseInt(values[2]):parseInt(values[2])) + ' ' + values[3] + ':' + values[4];
                }
            },
            cols: [
                // Years
                {
                    values: (function() {
                        var arr = [];
                        for (var i = today.getFullYear()-5; i <= today.getFullYear()+5; i++) {
                            arr.push(i);
                        }
                        return arr;
                    })(),
                    textAlign: 'left'
                }, {
                    divider: true,
                    content: '-'
                },
                // Months
                {
                    values: ('1 2 3 4 5 6 7 8 9 10 11 12').split(' '),
                    displayValues: ('1月 2月 3月 4月 5月 6月 7月 8月 9月 10月 11月 12月').split(' '),
                    textAlign: 'center'
                }, {
                    divider: true,
                    content: '- '
                },
                // Days
                {
                    values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
                },
                // Space divider
                {
                    divider: true,
                    content: '  '
                },
                // Hours
                {
                    values: (function() {
                        var arr = [];
                        for (var i = 0; i <= 23; i++) {
                            arr.push(i < 10 ? '0' + i : i);
                        }
                        return arr;
                    })(),
                },
                // Divider
                {
                    divider: true,
                    content: ':'
                },
                // Minutes
                {
                    values: (function() {
                        var arr = [];
                        for (var i = 0; i <= 59; i++) {
                            arr.push(i < 10 ? '0' + i : i);
                        }
                        return arr;
                    })(),
                }
            ],
            on: {
                open:function (picker) {

                    var htm="<div class='dialog-backdrop backdrop-in picker-backdrop'></div>";
                    $$(picker.$el).css('z-index','13500');
                    $$(picker.$el).parent().append(htm);
                    $$(picker.$el).parent().children('.picker-backdrop').click(function () {
                        picker.close()
                    })

                },
                close:function (picker) {
                    if($$(picker.$el).parent().children('.picker-backdrop').length!=0){
                        $$(picker.$el).parent().children('.picker-backdrop').removeClass('backdrop-in');
                        $$(picker.$el).parent().children('.picker-backdrop').remove();
                    };
                },
                change: function (picker, values, displayValues) {
                    var daysInMonth = new Date(picker.value[0], picker.value[1], 0).getDate();
                    if (values[2] > daysInMonth) {
                        picker.cols[4].setValue(daysInMonth);
                    }
                }
            }
        });
        return pickerInline;
    }
    window.pickerDate = pickerDate;

})(window, Dom7);