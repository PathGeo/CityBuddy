
//use json in the cookie
$.cookie.json=true;


//global variable
var app={
	searchResult:{},
	testmode:false,
	socket:io.connect("http://www.pathgeo.com:8080/socket-citybuddy"),
	mediaWall: null,
	readCookie:true, 
	map : null,
	initCenterLatLng : [35, -100],
	initCenterZoom : 4,
	heatmapLayer:null,
	clusterLayer:null,
	basemaps : {
		//"Light map": L.tileLayer("https://tiles.mapbox.com/v3/pathgeo.map-jwxvdo36/{z}/{x}/{y}.png?updated=1374825292888",{attribution:"Map Provided by <a href='http://www.mapbox.com/' target='_blank'>MapBox</a>", title:"Light Map"}),
		//"Terrain map": L.tileLayer("https://tiles.mapbox.com/v3/pathgeo.map-9p1ubd74/{z}/{x}/{y}.png?updated=1374825095067",{attribution:"Map Provided by <a href='http://www.mapbox.com/' target='_blank'>MapBox</a>", title:"Terrain Map"}),
		//"Night map": L.tileLayer("https://tiles.mapbox.com/v3/pathgeo.map-jkiqueqj/{z}/{x}/{y}.png?updated=1374825942470",{attribution:"Map Provided by <a href='http://www.mapbox.com/' target='_blank'>MapBox</a>", title:"Night Map"}),
		"Light Gray Background Map" : L.tileLayer("http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/{styleId}/256/{z}/{x}/{y}.png", {
			styleId : 22677,
			attribution : "Map Provided by <a href='http://cloudmade.com/' target='_blank'>Cloudmade</a>",
			title : "Cloudmade"
		}),
		"OpenStreet Map" : L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
			attribution : "Map Provided by <a href='http://www.openstreetmap.org/' target='_blank'>Open Street Map</a>",
			title : "Open Street Map",
			maxZoom:19
		}),
		"ESRI Imagery Map" : L.layerGroup([
			L.tileLayer("http://server.arcgisonline.com/ArcGIS/rest/services/{serviceName}/MapServer/tile/{z}/{y}/{x}", {
				serviceName: "World_Imagery",
				attribution : "Map Provided by <a href='http://www.arcgis.com/' target='_blank'>ESRI</a>",
				title : "ESRI Imagery Map"
			}),
			L.tileLayer("http://server.arcgisonline.com/ArcGIS/rest/services/{serviceName}/MapServer/tile/{z}/{y}/{x}", {
				serviceName: "Reference/World_Boundaries_and_Places",
				attribution : "Map Provided by <a href='http://www.arcgis.com/' target='_blank'>ESRI</a>",
				title : "ESRI Imagery Map"
			})
		]),
		"ESRI Street Map" : L.tileLayer("http://server.arcgisonline.com/ArcGIS/rest/services/{serviceName}/MapServer/tile/{z}/{y}/{x}", {
			serviceName: "World_Street_Map",
			attribution : "Map Provided by <a href='http://www.arcgis.com/' target='_blank'>ESRI</a>",
			title : "ESRI Street Map"
		}),
		"ESRI National Geographic Map" : L.tileLayer("http://server.arcgisonline.com/ArcGIS/rest/services/{serviceName}/MapServer/tile/{z}/{y}/{x}", {
			serviceName: "NatGeo_World_Map",
			attribution : "Map Provided by <a href='http://www.arcgis.com/' target='_blank'>ESRI</a>",
			title : "ESRI National Geographic Map",
			maxZoom:16
		}),
		"ESRI Terrain Map" : L.layerGroup([
			L.tileLayer("http://server.arcgisonline.com/ArcGIS/rest/services/{serviceName}/MapServer/tile/{z}/{y}/{x}", {
				serviceName: "World_Terrain_Base",
				attribution : "Map Provided by <a href='http://www.arcgis.com/' target='_blank'>ESRI</a>",
				title : "ESRI Terrain Map",
				maxZoom:13
			}),
			L.tileLayer("http://server.arcgisonline.com/ArcGIS/rest/services/{serviceName}/MapServer/tile/{z}/{y}/{x}", {
				serviceName: "Reference/World_Reference_Overlay",
				attribution : "Map Provided by <a href='http://www.arcgis.com/' target='_blank'>ESRI</a>",
				title : "ESRI Terrain Map",
				maxZoom:13
			}),
		]),
		"ESRI Topographic Map" : L.tileLayer("http://server.arcgisonline.com/ArcGIS/rest/services/{serviceName}/MapServer/tile/{z}/{y}/{x}", {
			serviceName: "World_Topo_Map",
			attribution : "Map Provided by <a href='http://www.arcgis.com/' target='_blank'>ESRI</a>",
			title : "ESRI Topographic Map"
		}),
		"ESRI Light Gray Map" : L.tileLayer("http://server.arcgisonline.com/ArcGIS/rest/services/{serviceName}/MapServer/tile/{z}/{y}/{x}", {
			serviceName: "Canvas/World_Light_Gray_Base",
			attribution : "Map Provided by <a href='http://www.arcgis.com/' target='_blank'>ESRI</a>",
			title : "ESRI Light Gray Map",
			maxZoom:16
		}),
		"ESRI Ocean Map" : L.tileLayer("http://server.arcgisonline.com/ArcGIS/rest/services/{serviceName}/MapServer/tile/{z}/{y}/{x}", {
			serviceName: "Ocean_Basemap",
			attribution : "Map Provided by <a href='http://www.arcgis.com/' target='_blank'>ESRI</a>",
			title : "ESRI Ocean Map",
			maxZoom:12
		})
		//"Google Streetmap":L.tileLayer("https://mts{s}.googleapis.com/vt?lyrs=m@207265067&src=apiv3&hl=zh-TW&x={x}&y={y}&z={z}&s=Ga&style=api%7Csmartmaps",{subdomains:"123", attribution:"Map Source from Google"})
	}
}





$(function(){
		init_UI();
		
		init_map();
		
		
		//init socket
		init_socket();
		

		//search event
		searchEvent({showSlider:true});


		
		//when swtich to page-map
		$("#page-map").on({
			"pageshow":function(e, ui){
				var $this=$(this);
			
				setTimeout(function(){
					$("#page-map #map").css({height: $this.height()-$this.find(".ui-header").height()-2})
					//resize the map
					app.map.invalidateSize();

					//if this is first time to switch to map page
					if(app.heatmapLayer.options.visible === undefined || app.clusterLayer.options.visible===undefined){
						//add markercluster adn heatmap on the map
						app.clusterLayer.addTo(app.map).options.visible=true;
						app.heatmapLayer.addTo(app.map).options.visible=true;
					}
				}, 10);
			
			}
		})
		

		//when switch pages
		$("div[data-role='page']").on({
			"pageinit": function(){
				
			},
			
			"pagebeforeshow": function(e, ui){
				var $this=$(this),
					id=$this.attr("id"),
					eventID=$this.attr("data-eventID") || ((location.href.indexOf("?id=")!=-1)?location.href.match(/id=([^&]+)/)[1]:null);
				
				
				if(id=='page-eventDetail' && eventID && eventID!=''){
						//add id into url parameter
						if(location.href.indexOf("?id=")==-1){
							location.href+="?id="+eventID
						}
						//get event
						getEventDetail(eventID);
				} 
			
			},
			
			"pageshow":function(e,ui){
				$this=$(this);
				
				
				$this.find("ul[data-role='listview']").listview("refresh");
				
				
				
				var id=$this.attr("id");
				if(id&&id!=''){
					switch(id){
						case "page-eventDetail":
							
							
							
							
							//media wall
							$("div.item img").each(function(){
								var w=1 + 3 * Math.random() << 0;
								
								//$(this).css({width: w*100})
								//.load(function(){
								//	console.log('image loaded');
								//	app.mediaWall.fitWidth();
								//});
							});
							
							/**
							app.mediaWall=new freewall("#mediaWall");
							
							app.mediaWall.reset({
								selector: '.item',
								animate: true,
								cellW: 'auto',
								cellH: 150,
								onResize: function() {
									app.mediaWall.fitWidth();
								}
							});
							app.mediaWall.fitWidth();
							$(window).trigger("resize");
							*/
						break;
						
						
						
					}
					
				}
				
				
				
			}
		});
		
		//when resize the window
		$(window).on({
			"resize":function(){
				
				var $this=$("#page-map");
				$("#page-map #map").css({height: $this.height()-$this.find(".ui-header").height()-2})
				app.map.invalidateSize(); 
			}
		})
});





/**
 * init UI 
 */
function init_UI(){
	$("body>[data-role='panel']").panel().find("[data-role='listview']").listview();

}



/**
 * socket 
 */
function init_socket(){
	app.socket.on("connected", function(data){
		console.log(data)
	})
		
	
	app.socket.on("broadcast", function(tweet){
		if(tweet){

			var lat, lng;
			if(tweet.geo && tweet.geo.coordinates){
				lat=tweet.geo.coordinates[0];
				lng=tweet.geo.coordinates[1];
			}else{
				lat=tweet.lat;
				lng=tweet.lon;
			}
					
			if(lat&&lng){
				//app.points.push({lat:lat, lon:lng, value:1});
				//marker
				var marker=new L.Marker(new L.LatLng(lat, lng)),
					point=new L.LatLng(lat, lng);
				
				
				marker.tweet=tweet;
				marker.bindPopup(tweet.text);
				marker.on("click", function(e){
					//embed tweet
					if(e.target && e.target.tweet){
						var t=e.target.tweet,
							html="<blockquote class='twitter-tweet'><p><a href='https://twitter.com/"+t.user.screen_name+"/statuses/"+t.id+"'></a></blockquote>";
						$("#tweetContent").html(html).show();
						twttr.widgets.load();
					}
				});
				
				
				
				app.clusterLayer.addLayer(marker);
				
				//heatmap
				app.heatmapLayer.addLatLng(point);
						
			
				
			}
		}
	});

}




/**
 * init map 
 */
function init_map(){

	app.map = L.map("map", {
		center : app.initCenterLatLng,
		zoom : app.initCenterZoom,
		layers : [app.basemaps["ESRI National Geographic Map"]],
		attributionControl : true,
		trackResize : true
	});

	//set up current basemap
	app.map.currentBasemap=app.basemaps["ESRI National Geographic Map"];
	

	//move the location of zoomcontrol to the bottom right
	app.map.zoomControl.setPosition("bottomright");
	
	
	//add heatmap layer
	var empty_geojson=[{"type":"Feature", "properties":{}, "geometry":{"type":"Point", "coordinates":[]}}];
	app.heatmapLayer = L.heatLayer([], {radius: 50});
	
	
	//clusterlayer
	app.clusterLayer=pathgeo.layer.markerCluster(null,{},{
			//clusterclick event
			clusterclick : clusterClickHandler
	})
	
	
	//controls
	var controls={
		mapGallery : L.Control.extend({
			options : {
				"collapsed" : true,
				"position" : 'topright',
				"text" : 'Map Gallery'
			},
			initialize : function(options) {
				L.Util.setOptions(this, options);
			},
			onAdd : function(map) {
				// create the control container with a particular class name
				var container = L.DomUtil.create('div', 'leaflet-control-mapGallery');
				var html = "<ul>"+
							"<li title='Cluster Map' layer='clusterLayer' style='background-color:#5B92C0'><img src='images/gallery-cluster.png' /></li>"+
							"<li title='Hotspots' layer='heatmapLayer' style='background-color:#5B92C0'><img src='images/gallery-heatmap.png' /></li>"+
						   "</ul>";


				//click map gallery event
				$(container).html(html).find("ul li").on({
					click : function() {
						var $this = $(this), value = $this.attr("layer"), layer = app[value];
						
						//if this layer is already shown on the map, hide the layer and change the color
						if (layer.options.visible) {
							//hide layers
							//if geoJsonLayer >> hide all _icon. Other layers, remove layer from map
							if(value=='clusterLayer'){  
								$("#tweetContent").hide();
							}
							
							app.map.removeLayer(layer)
					
//							app.map.removeLayer(layer);
							$this.css({"background-color" : ''});
							
							layer.options.visible=false;
						} else {
							
							layer.addTo(app.map)
						
						
							//make the markerclusterlayer more priority
							if(value=='clusterLayer'){
								layer.bringToFront();
								layer.on("clusterclick", clusterClickHandler);
							}
							
							$this.css({"background-color" : "#5B92C0"});

							layer.options.visible=true;
						}
					},
					mouseover : function() {
						// $(".mapPopupWidget, #basemapWidget").hide();
						// var $this = $(this), value = $this.attr("layer"), layer = app.geocodingResult[value];
// 
						// //only the layer is activated
						// if (layer.options.visible) {
							// //show map popup window
							// $("#mapPopup_" + value).show();
						// }
					},
					mouseleave : function() {

					}
				});
				return container
			}
		}),
		tocThumbnail: L.Control.extend({
			options : {
				"position" : 'topright',
				"text" : 'Change Base Maps'
			},
			initialize : function(options) {L.Util.setOptions(this, options);},
			onAdd : function(map) {
				//create div element
				var mainContent=L.DomUtil.create('div', 'leaflet-control-tocThumbnail'),
					html="<a class='leaflet-control-layers-toggle' href='#' title='Layers'></a>"+ $("#basemapWidget")[0].outerHTML;
				
				$(mainContent).html(html)
					.addClass('leaflet-control-layers')
					.on({
						"mouseover":mouseoverEvent,
						"click": mouseoverEvent
					})
					.find("ul li").click(function(){
						switchBaseLayer($(this).attr('title'));
					});

				//monuseoverEvent on the basemapWidget
				function mouseoverEvent(e){
					$("#basemapWidget").show().on({
						"mouseleave":function(){
							$(this).hide();
						}
					});
				}
				
				return mainContent;
			}
		})
	}
	
	
	//add map gallery control
	$.each(controls, function(k,v){
		app.map.addControl(new v());
	})
	
	
	//insert a div, tweetContent
	$("#map").append("<div id='tweetContent'></div>");


}



//switch basemap
function switchBaseLayer(type){
	var layer = app.basemaps[type] || null,
		map=app.map;
	
	if(layer){
		if(app.map.currentBasemap){
			map.removeLayer(app.map.currentBasemap);
		}
		map.addLayer(layer);
		app.map.currentBasemap=layer;
		
		//fire baselayerchange event
		map.fire('baselayerchange', {layer: layer});
	}
}





/**
 * marker cluster click event 
 */
var clusterClickHandler=function(e){
	if(e.layer && e.layer._childCount){
		if(e.layer._childCount >= 101){
			alert("Please zoom in to decrease the number of markers less than 100");
			return; 
		}
	}
	
	//show loading
	$("#tweetContent").html("<img src='images/loading.gif' />").show();
			

			
	var tweets = pathgeo.util.readClusterFeatureProperies(e.layer, [], "tweet");
	var html = "<div class='popup'>There are <b>" + e.layer._childCount + "</b> tweets:<p></p>";
	
	//open popup for the cluster
	e.layer.bindPopup(html, {
		maxWidth : 500,
		maxHeight : 300
	}).openPopup();
				
	//show tweet
	var t_html=""
	$.each(tweets, function(i,t){
		t_html+="<blockquote class='twitter-tweet'><p><a href='https://twitter.com/"+t.user.screen_name+"/statuses/"+t.id+"'></a></blockquote>";
	})
	$("#tweetContent").html(t_html);
	twttr.widgets.load();
}





/***
 * searchEvent 
 * @param {String location
 */
function searchEvent(options){
	//options
	var now=new Date(),
		today=now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate(),
		twoWeekDate=new Date(now.getTime()+ (1000*60*60*24*14)),
		twoWeek=twoWeekDate.getFullYear()+"-"+(twoWeekDate.getMonth()+1)+"-"+twoWeekDate.getDate();

	
	if(!options){options={}}
	options.titles=options.titles || "";
	options.performers=options.performers || "";
	options.startDate=options.startDate || today;
	options.endDate=options.endDate || twoWeek;
	options.venue=options.venue || "";
	options.categories=options.categories || "";
	options.showSlider=options.showSlider || false;
	
	//trim
	var trim=function(array){
		return $.map(array, function(v,i){return $.trim(v)})
	};
	options.titles=trim(options.titles.split(","));
	options.performers=trim(options.performers.split(","));
	options.categories=trim(options.categories.split(","));
	

	var url=(app.testmode)?"db/template_queryEvent.json":"http://www.pathgeo.com:8080/citybuddy/query?title="+options.titles.join(",")+"&startDate="+options.startDate+"&endDate="+options.endDate+"&categories="+options.categories.join(",")+"&performers="+options.performers.join(",")+"&venue="+options.venue +"&jsoncallback=?";
	
	//query event
	$.getJSON(url, function(json){
		if(json){
			var obj={}
			$.each(json, function(i,v){
				obj[v.id]=v
			})
			app.searchResult=obj;

			//generate search list
			showSearchResult(json, options.showSlider);
		}	
	});
}




/**
 * showSearchResult 
 * @param {Array} results
 */
function showSearchResult(results, showSlider){
	var html='',
		html_slider='',
		length=results.length,
		$target=$("#searchResult"),
		$slider=$("#slider"),
		venue,
		star="<img src='images/1399611719_star.png' alt='Social Rank'/>&nbsp; ",
		groups={},
		date="";

	//sort results by date
	results.sort(function(a,b){
		return moment.utc(a.startDate_utc) - moment.utc(b.startDate_utc);
	})
	
	
	//regroup event by dates
	$.each(results, function(i,evt){
		evt.startDate_local=moment.utc(evt.startDate_utc).local();
		date=evt.startDate_local.format("ddd, MMM Do, YYYY");
		
		evt.startDate_localString=date;
		
		if(!groups[date]){
			groups[date]=[evt]
		}else{
			groups[date].push(evt);
		}
	})

	
	//show results
	$.each(groups, function(date, events){
		
		html+= "<li data-role='list-divider'>"+date+"<span class='ui-li-count'>"+events.length+"</span></li>";
		
		//sort events by date
		events.sort(function(a,b){
			return moment.utc(a.startDate_utc) - moment.utc(b.startDate_utc);
		})
	
		
		//parse event
		$.each(events, function(i,evt){
			evt.thumbnail=evt.thumbnail || "images/1394974803_plan.png";
			var description=String(evt.description).substr(0, 300) + '.....',
				venue=evt.venue,
				reviews=evt.reviews,
				score=(function(){
					if(evt.totalScore){
						var count=Math.round(evt.totalScore / 20);	
						return new Array(count+1).join(star);
					}
				})(),
				categories=$.map(evt.categories, function(v,i){return "<p class='tag'>"+v.name+"</p>"})
	
			
			//html
			html+= "<li data-id='"+evt.id+"'><a href='#'>"+
			    		"<img src='"+evt.thumbnail+"' />"+
					    "<h2>"+evt.title+"</h2>"+
					    "<p><strong>"+evt.startDate_local.format("YYYY-MM-DD  HH:mm:ss")+"</strong></p>"+
					    "<p>"+venue.name+"</p>"+
					    "<p class='ui-li-aside'>"+score+"</p>"+
			    		"<div class='tagContent'>"+categories.join("")+"</div>"+
			    	"</a></li>";
			
			
			
			if(showSlider){
				html_slider+="<li data-id='"+evt.id+"''>"+
				 	"<img src='"+evt.thumbnail+"'>"+
				 	"<div class='flex-caption'>"+
				 		"<h1>"+evt.title+"</h1>"+
				 		"<p>"+evt.startDate_local.format("YYYY-MM-DD  HH:mm:ss")+" @ <a href='"+ ((venue.url&&venue.url!='')?venue.url:"#")+"' target='_blank'>"+venue.name+"</a><br>"+venue.address+"</p>"+
				 		"<div class='socialRank'>"+ score +"</div>"+
				 	"</div>"+
				 "</li>";
			}
		});
	});
	
	
	//show
	$target.html(html).find("li:not([data-role='list-divider'])").click(function(e){
		$("#page-eventDetail").attr("data-eventID", $(this).attr('data-id'));
		changePage("#page-eventDetail");
	});


	if(showSlider){
		$slider.find("ul.slides").html(html_slider).find("li").click(function(e){
			$("#page-eventDetail").attr("data-eventID", $(this).attr('data-id'));
			changePage("#page-eventDetail");
			
		});
		$slider.flexslider({
			animation: "fade"
		});
	}else{
		//switch to page-searchResult
		changePage("#page-searchResult");
	}
	
}






/**
 * getEventDetail 
 */
function getEventDetail(id){
	if(id && id!=''){
		var url=(app.testmode)?"db/template_getEventDetail.json":"http://www.pathgeo.com:8080/citybuddy/event/"+id+"?jsoncallback=?";
		
		if(app.searchResult && app.searchResult[id] && app.searchResult[id].reviews){
			showEventDetail(app.searchResult[id]);
		}else{
			$.getJSON(url, function(json){
				if(json && !json.msg){
					if(app.searchResult[id]){
						app.searchResult[id].reviews=json.reviews;
						app.searchResult[id].tickets=json.tickets;
					}else{
						app.searchResult[id]=json;
					}
					
					showEventDetail(app.searchResult[id]);
				}else{
					console.log("[ERROR] getEventDetail: "+json.msg);
				}
			});
		}
	}
}





/**
 *  showEventDetail 
 */
function showEventDetail(evt){	

	//event info
	var $target=$("#detail_meta"),
		html_info="<li class='detail-title'>"+evt.title+"</li>"+
				  "<li class='detail-time'>"+evt.startDate_localString+"</li>"+
				  "<li class='detail-location'>"+evt.venue.name + "<br><label>"+evt.venue.address+"</label></li>"+
				  "<li class='detail-description'>"+evt.description + "</li>";
				  
	var objs={};
				  
	$target.find(".event-image img").attr("src", evt.thumbnail);
	$target.find(".event-info > ul").html(html_info);
	

	
	//event photos and comments from social media
	if(evt.reviews){
		var medias={}, html_media="", html_comment="", count=0;
		
		$.each(evt.reviews, function(source, comments){
			
			if(source!='totalScore'){
				//parse comments
				$.each(comments, function(i,obj){
					//console.log(obj)
					html_media+=composeMediaWallHtml(obj.images)
					html_media+=composeMediaWallHtml(obj.videos)
					
					html_comment+=composeCommentHtml(obj)
				});
			}
			
		});
		
		$("#detail_mediaWall").html("<h3>Media from Twitter & Facebook</h3>"+html_media);
		$("#detail_comment > ul").html(html_comment).listview();
	}


	
	//comment
	function composeCommentHtml(obj){
		obj.profileImage=obj.profileImage || "images/1401336095_social_8.png"
		
		return "<li><a target='_blank' href='https://twitter.com/"+obj.username+"/status/"+obj.id+"'>"+
				    "<img src='"+obj.profileImage+"'/>"+
				    "<h2>"+obj.username+"</h2>"+
				    "<p>"+obj.content+"</p>"+
			   "</a></li>";
	}
	
	
	
	
	
	//mediaWall

	function composeMediaWallHtml(array){
		var classes=["ui-block-a","ui-block-b","ui-block-c","ui-block-d"],
			c="",
			isVideo=false,
			result="";
		
		array=$.map(array, function(v,i){
			//detemine class
			c=classes[count % 4];
			
			
			result="";
			

			if(!objs[v]){
				
				count++
			
				//determine source
				var check=v.match('www.youtube.com') || v.match(/www.facebook.com\/photo.php\?v=(.*)/);
				if (check){
					if(check[0]=='www.youtube.com'){
						result="<iframe class='opengraph-video'  src='https://www.youtube.com/embed/"+ decodeURIComponent(v+"&").match(/v=(.*)&/)[1].split('&')[0] +"' frameborder='0' allowfullscreen></iframe>";
					}else{
						result="<iframe class='opengraph-video' src='https://www.facebook.com/video/embed?video_id="+check[1]+"' frameborder='0' allowfullscreen></iframe>"; 
					}
				}else{
					result="<img src='"+ v +"' />";
				}
				
				objs[v]=v;
		
				
				return "<div class='item "+c+"'>"+result+"</div>";
			}
		});
		return array.join("");
	}
	
}
	




function changePage(target, options){
	if(!options){options={}}
	
	$.mobile.pageContainer.pagecontainer("change", target, options);
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


