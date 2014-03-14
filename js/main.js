

$(function(){
	
	$('.sidebar li').click(function(){
		var $this=$(this),
			href=$this.find('>a').attr('href');
		
		$this.siblings().removeClass('active');
		$this.addClass('active');

		console.log(href);
	});
	
	
	searchEvent();
});






/***
 * searchEvent 
 * @param {String location
 */
function searchEvent(location){
	var json={};
	//$.getJSON(url, function(json){
		//if(json){
			//generate search list
			showSearchResult(json);
		//}
		
	//});
}



/**
 * showSearchResult 
 * @param {Object} json
 */
function showSearchResult(json){
	
	json.description="The Boys & Girls Clubs of Greater San Diego CHANGES LIVES through quality youth programs and guidance in a safe, affordable and fun environment. Great futures have been starting here for over 70 years. We serve youth ages 5-18 years old with programs that promote ACADEMIC SUCCESS, CHARACTER DEVELOPMENT and HEALTHY LIFESTYLE at 17 community-based sites county-wide. We are making a difference in the lives of San Diego future leaders - our youth!";
	json.description=String(json.description).substr(0, 300) + '.....';
	
	var html='<li>'+
			 	'<img class="result-image" src="http://cosmicworld.com/static/img/random-photo-4.jpg" />'+
			 	'<div class="result-info">'+
			 		'<div class="result-name"><a href="http://cosmicworld.com/locations/san-diego/" target="_blank">Cosmic Run San Diego</a></div>'+
			 		'<div class="result-time">Saturday, March 22nd</div>'+
			 		'<div class="result-location">Qualcomm Stadium</div>'+
			 		'<div class="result-social">social</div>'+
			 		'<div class="result-description">'+json.description +'</div>'+
			 	'</div>'+
			 	'<img class="result-more" src="images/1394835495_information-frame_blue.png" />'+
			 '</li>';
	
	$('#searchResult').append(html);
	
	
	$('#searchResult .result-more').click(function(){
		$('.popup').modal('show');
	})
}



