/**
 * @author:chaozhang5
 * @mail:chaozhang5@iflytek.com
 * @time:2015.08.04
 *
 * @description  requirejs的配置
 */

var requireConfig = {
    /**
     * bserUrl：用来配置模块根目录，可以是绝对路径也可以是相对路径
     * 相对路径指的是以引入requireJS页面为参考点 这里使用的就是相对路径
     */
    baseUrl: "js/common",

    /**
     * paths：用来映射不存在根路径下面的模块路径
     */
    paths: {
        zepto:'zepto',
        doT: 'doT',
        fly: 'fly',
        card:'card',
        swiper: 'plugins/Swiper-2.7.6/idangerous.swiper'
    }
};
