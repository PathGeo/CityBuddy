//global variable
var app={
	searchResult:null,
	testmode:true
}





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
	var url=(app.testmode)?"db/searchEvent.json":"ws/searchEvent.py?location="+location+"&time=&category=";
	
	//search event
	$.getJSON(url, function(json){
		if(json){
			app.searchResult=json;
			
			//generate search list
			showSearchResult(json);
		}	
	});
}



/**
 * showSearchResult 
 * @param {Object} json
 */
function showSearchResult(json){
	var html=''
	
	$.each(json, function(i, evt){
		evt.thumbnail=evt.thumbnail || "images/1394974803_plan.png";
		var description=String(evt.description).substr(0, 300) + '.....';
		
		//html
		html='<li>'+
				 '<img class="result-image" src="' +evt.thumbnail+ '" />'+
				 '<div class="result-info">'+
				 	'<div class="result-name">' +((evt.url && evt.url.wesbsite)?"<a href='"+evt.url.website+"' target='_blank'>"+evt.name+"</a>":evt.name)+'</div>'+
				 	'<div class="result-time">'+evt.time+'</div>'+
				 	'<div class="result-location">'+evt.location+'</div>'+
				 	'<div class="result-social">social</div>'+
				 	'<div class="result-description">'+description+'</div>'+
				 '</div>'+
				 '<img class="result-more" src="images/1394835495_information-frame_blue.png" data-id="'+i+'" />'+
			 '</li>';
		
		$('#searchResult').append(html);
	})
	
	
	//click event on result-more class
	$('#searchResult .result-more').click(function(){
		var $this=$(this);
		var id=$this.attr('data-id');
		
		if(id){
			showPopup(app.searchResult[id]);
		}
	});
}



/**
 * showPopup 
 * @param {Object} obj Event obj
 */
function showPopup(obj){
	var $popup=$("#eventDetail");
	
	//popup title
	$popup.find('.modal-title').html(obj.name);
	
	//popup body
	var html=obj.description;
	$popup.find('.modal-body').html(html)
	
	//show popup
	$('.popup').modal('show');
}


