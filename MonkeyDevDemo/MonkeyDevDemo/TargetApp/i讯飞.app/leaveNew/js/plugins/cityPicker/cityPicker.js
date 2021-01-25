/**
 *
 * cityPicker.js
 * cityPicker is made by Framework picker component which effects like iOS native select.
 *
 * nzb329@163.com
 *
 * 2017-10-28
 *
 */
;
(function(window, $$, undefined) {

    /**
     * [getProvince 获取省]
     * @param  {[Object]} regions [省市区数据]
     * @return {[Array]}          [省数组]
     */
    function getProvince(regions) {

        return regions['provincesArr'];
    }

    /**
     * [getCity 获取市]
     * @param  {[Object]} regions      [省市区数据]
     * @param  {[String]} provinceName [省名]
     * @return {[Array]}               [市数组]
     */
    function getCity(regions, provinceName) {

        return regions['provinces'][provinceName]['citiesArr'];
    }

    /**
     * [getArea 获取区]
     * @param  {[Object]} regions      [省市区数据]
     * @param  {[String]} provinceName [省名]
     * @param  {[String]} cityName     [市名]
     * @return {[Array]}               [区数组]
     */
    function getArea(regions, provinceName, cityName) {

        return regions['provinces'][provinceName]['cities'][cityName]['areasArr'];

    }

    // 初始化省市区
    var province = getProvince(regions),
        city = getCity(regions, '北京市'),
        area = getArea(regions, '北京市', '北京市');

    // 保存 picker 选择的省
    var provinceSelect = '';

    // 省市区联动 / Framework7 picker
    var pickerLocation=function(input){

        var picker = app.picker.create({
            inputEl: input,
            rotateEffect: true,
            toolbarCloseText:'确定',
            toolbarTemplate: '<div class="toolbar">\
                                <div class="toolbar-inner">\
                                    <div class="left">\
                                    </div>\
                                    <div class="right">\
                                        <a href="#" class="link close-picker">完成</a>\
                                    </div>\
                                </div>\
                            </div>',
            cols: [{
                    cssClass: 'f-s-14',
                    width: '33.33%',
                    textAlign: 'left',
                    values: province,
                    onChange: function(picker, province) {
                        debugger
                        if (picker.cols[1].replaceValues) {
                            provinceSelect = province;
                            city = getCity(regions, province);
                            area = getArea(regions, province, city[0]);
                            picker.cols[1].replaceValues(city);
                            picker.cols[2].replaceValues(area);
                        }
                    }
                },
                {
                    cssClass: 'f-s-14',
                    width: '33.33%',
                    textAlign: 'center',
                    values: city,
                    onChange: function(picker, city) {
                        if (picker.cols[2].replaceValues) {
                            area = getArea(regions, provinceSelect, city);
                            picker.cols[2].replaceValues(area);
                        }
                    }
                },
                {
                    cssClass: 'f-s-14',
                    width: '33.33%',
                    textAlign: 'right',
                    values: area,
                }
            ],
            on:{
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
                    $$(this.input).val(picker.displayValue.join(' '))
                },
                change: function (picker, values, displayValues) {
                    var daysInMonth = new Date(picker.value[0], picker.value[1], 0).getDate();
                    if (values[2] > daysInMonth) {
                        picker.cols[4].setValue(daysInMonth);
                    }
                }
            }
        });
        return picker;
    }
    
    window.pickerLocation=pickerLocation;
})(window, Dom7);
