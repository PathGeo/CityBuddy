if(!window.pathgeo){window.pathgeo={}}

pathgeo.util={
	/**
	 * convert javascript object to html
	 * @param {Object} obj
	 * @param {Array} notShowArray is an array of string which is not shown in the html
	 * @return {String} html string
	 */
	objectToHtml: function(obj, notShowArray){
		if(!obj){console.log("[ERROR]pathgeo.util.objectToHtml: obj is null!");return;}
		
		if(!notShowArray){notShowArray=[]}
		
		var html="<ul class='objToHtml'>";
		for(var k in obj){
			//if k (a property) is not in the notShowArray($.inArray(k, notShowArray)==-1) 
			if($.inArray(k, notShowArray)==-1){
				html+="<li><b>"+k+"</b>: " + obj[k] + "</li>";
			}
		}
		html+="</ul>";
		
		return html;
	},
	
	
	
	/** 
	 *  highlight keyword
	 */
	highlightKeyword: function(keywords, html){
		//highlight keyword
		var rgxp,rep1;
		$.each(keywords, function(j,keyword){
			rgxp = new RegExp(keyword, 'ig');
			repl = '<span class="highlightKeyword">' + keyword + '</span>';
			html = html.replace(rgxp, repl);
		});
		return html;
	},
	
	
	
	/**
	 * read all features properies in the cluster
	 */
	readClusterFeatureProperies: function(clusterObj, properties, propertyName){
		if(clusterObj._markers.length>0){
			$.each(clusterObj._markers, function(i,marker){
				properties.push(marker[propertyName]);
			});
		}
		
		if(clusterObj._childClusters.length>0){
			$.each(clusterObj._childClusters, function(i,cluster){
				properties.concat(pathgeo.util.readClusterFeatureProperies(cluster, properties, propertyName));
			});
		}
		return properties;
	},
	
	
	/**
	 * parse geojsonProperties to Array
	 * @param {GEOJSON} geojson can be featureColleciton or a feature
	 * @return {Object} containing {columns: an array of titles, datas: an array of properties}
	 */
	geojsonPropertiesToArray: function(geojson, options){
		if(!geojson){console.log("[ERROR] pathgeo.util.geoJsonPropertiesToArray: no geojson");return;}
		
		var obj={
			columns_dataTable:[],
			columns:[],
			datas:[],
			googleChartData:[],
			statisticsColumn:{}
		}
		
		//options
		if(!options){options={}}
		options.statisticsColumn=options.statisticsColumn || null
		
		if(options.statisticsColumn){
			obj.statisticsColumn[options.statisticsColumn]={
				"sum":0
			};
		}
		
		
		//if geojson is an array
		if(geojson instanceof Array){
			geojson={type:"FeatureCollection", features:geojson};
		}
		
		
		//geojson is featureCollection
		if(geojson.type.toUpperCase()=='FEATURECOLLECTION'){
				$.each(geojson.features, function(i, feature){
					//get columns
					if(i==0){
						var temp=parseFeature(i, feature, true);
						obj.columns_dataTable=temp.columns_dataTable;
						obj.columns=temp.columns;
						obj.datas.push(temp.datas);
					}else{
						obj.datas.push(parseFeature(i, feature, false).datas)
					}
					
					//statistics
					if(options.statisticsColumn){
						obj.statisticsColumn[options.statisticsColumn]['sum']+=parseFloat(feature.properties[options.statisticsColumn])
					}
				});
		}
			
			
		//geojson is a feature
		if(geojson.type.toUpperCase()=='FEATURE'){
				var temp=parseFeature(0, geojson, true);
				obj.columns=temp.columns;
				obj.columns_dataTable=temp.columns_dataTable;
				obj.datas.push(temp.datas);
		}
		
		
	
		
		//googleChartData
		obj.googleChartData=obj.datas.slice(0);
		obj.googleChartData.splice(0,0,obj.columns);

		return obj;
		
		
		//parse Feature
		function parseFeature(i, feature, needColumns){
			var columns_dataTable=[], columns=[], datas=[];
			datas[0]=i+1; //for ID
			if(needColumns){
				columns_dataTable[0]={"sTitle": "ID"}
				columns[0]="ID";
			}
			
			//if (!options.orderedColumns) {
			$.each(feature.properties, function(k,v){
				//check if td contains http hyperlink
				var hasHyperlink=false, value=String(v).toUpperCase();
				if(value.indexOf("HTTP://")>=0 || value.indexOf("HTTPS://")>=0){
					//start from http://
					v=pathgeo.util.linkify(String(v));
					hasHyperlink=true;
				}
				
				if(needColumns){
					var obj={"sTitle": k};
					
					if(hasHyperlink){
						obj.sType='html';
					}
					columns_dataTable.push(obj)
					columns.push(k);
				}
				datas.push(v);
			});
			
			
			//add coordinates
			if(feature.geometry.type=="Point"){
				if(needColumns){
					columns_dataTable.push({"sTitle": "Coordinates"});
					columns.push("Coordinates");
				};
				var lat=feature.geometry.coordinates[1].toFixed(3),
					lng=feature.geometry.coordinates[0].toFixed(3)
				
				datas.push(lng+", "+lat);
			}
			
			return {columns:columns, columns_dataTable:columns_dataTable, datas:datas}
		}
	},
	
	/**
	 * convert text to link if contains http, https, ftp, mailto
	 * from http://stackoverflow.com/questions/247479/jquery-text-to-link-script
	 * @param {String} content
	 */
	linkify: function(content){
		var url1 = /(^|&lt;|\s)(www\..+?\..+?)(\s|&gt;|$)/g,
      		url2 = /(^|&lt;|\s)(((https?|ftp):\/\/|mailto:).+?)(\s|&gt;|$)/g;
		
		content = content.replace(/&/g, '&amp;')
                         .replace(/</g, '&lt;')
                         .replace(/>/g, '&gt;')
                         .replace(url1, '$1<a target="_blank" href="http://$2">$2</a>$3')
                         .replace(url2, '$1<a target="_blank" href="$2">$2</a>$5');
						 
		return content
	}
	
	
	
		
}
