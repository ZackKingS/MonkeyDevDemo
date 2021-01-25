$$(document).on('pageInit', '.page[data-page="ifly_Information_special"]', function(e) {
	
	var myExpenseAccountPage = $$('#specialList');

	
	myExpenseAccountPage.on('infinite', function() {
		if(loading) return;

		loading = true;

		$$('.infinite-scroll-preloader').show();

		setTimeout(function() {
		
			loading = false;

            pageCount++;
			getSubjectList(subId,showSubjectList);
	
		}, 800);
	});
});
