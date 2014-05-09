//global variable
var app={
	searchResult:null,
	testmode:true
}





$(function(){
	
	
	
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
	var html='<div class="carousel-inner">',
		length=json.length,
		$target=$("#WeekHotEvent"),
		html_index="<ol class='carousel-indicators'>",
		venue,
		star="<img src='images/1399611719_star.png' alt='Social Rank'/>&nbsp; &nbsp; ";
	

	//read json
	$.each(json, function(i, evt){
		evt.thumbnail=evt.thumbnail || "images/1394974803_plan.png";
		var description=String(evt.description).substr(0, 300) + '.....';
		venue=evt.venue;
		reviews=evt.reviews; 
		
		//insert index
		html_index+="<li data-target='#WeekHotEvent' data-slide-to='"+i+"' class='"+((i==0)?"active":"")+"'></li>";
		
		//html
		html+="<div class='item"+((i==0)?" active":"")+"'>"+
			 	"<img src='"+evt.thumbnail+"'>"+
			 	"<div class='carousel-caption'>"+
			 		"<h1>"+evt.name+"</h1>"+
			 		"<p>"+evt.date+", "+evt.time+" @ <a href='"+ ((venue.url&&venue.url!='')?venue.url:"#")+"' target='_blank'>"+venue.name+"</a><br>"+venue.address+"</p>"+
			 		"<div class='socialRank'>"+ (function(count){
			 			//repeat star
			 			if(count>0){
			 				return new Array(count+1).join(star);
			 			}
			 		})(reviews.rank) +"</div>"+
			 	"</div>"+
			 "</div>";
				
		
	});
	
	
	$target.append(html_index).append(html).carousel();
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


