var access_token = 'EAACEdEose0cBACwBJjOTZC4uEmLaLVZCZAzEvr4W5W10Poj1lIo6CauvXZBjm23UjfxFp78EJ39lC3Eqllaa4zl93EWhLzHvY2HewjrDQX3L9eGUboeZCFCIJbVL33VRveZBFRSFJAQ4JZAlK4V6E6Tf2HJLbbqDXw7kYWbZA2JnMfZBTudNf2T6mwTntIFZCe5cgZD';
var isValid = false;
var page = 0;
var gotFeed = false; 
function place(flipbookChange){
	
		$('.modal').modal();

		$(".position-book").css("margin-left", ($(window).width() - 1000)/2);
		
		if( flipbookChange == true && gotFeed == true){
			initFlipbook();
		}

		 $("#submit").on('click',getAccessToken)
}

/* photo stack  */

function initPhotostack(src, desc){
	if (desc == null){
		desc = '' 
	}
	var make = '<div id = "stack"><div class = "figure"><a  class="photostack-img"><img src="' + src +'" /></a><div class= "figcaption"><h2 class="photostack-title">' + desc + '</h2></div></div>';
	$('#stack').append(make);
}
function getData(){
	if(isValid == true){
		$.ajax('https://graph.facebook.com/me?fields=photos{images,name}&access_token='+access_token,{
			success : function(response){
				console.log(response.photos.data);
				$.each(response.photos.data,function(index, data){
					if(data.images.length == 9){
					initPhotostack(data.images[4].source, data.name);
				}
					else
					{
					initPhotostack(data.images[1].source, data.name);
				}	
				});
				new Photostack(document.getElementById('photostack-1'), {} );
	         }           
		});
	}
}

function getAccessToken(){
	access_token = $('#access_token').val();
	isValid = true;
	$('#loader').css("visibility","visible");
			addCover();
			getData();
			getFeed();

}



/*   lookbook   */
function getImage(){
	if(isValid == true){
		$.ajax('https://graph.facebook.com/me?fields=cover&access_token=' + access_token,{
					success : function(response){
				console.log(response.cover.source);
				$('.cover').css('background','linear-gradient(rgba(40,57,101,.5), rgba(40,57,101,.5)),url(' + response.cover.source + ') center no-repeat');
				$('.cover').css('background-size','cover');
			}
		});
	}
}


function addGradient(){

	var makeOdd = '<div class = "gradient-odd" ></div>'
	var makeEven  = '<div class = "gradient-even"></div>'
	$('.odd').prepend(makeOdd);
	$('.even').prepend(makeEven);
}

function getFeed(){
	$.ajax('https://graph.facebook.com/me/feed?fields=id,name,description,full_picture&access_token=' + access_token,{
		success : function(response){
		console.log(response);
		$.each(response.data,function(index, data){
			feedUpdate(index,data);
		})
		addBackCover();
		gotFeed = true;

		initFlipbook();
		addGradient();
		finishSetup();
	}	
	});
}

function newPage(page){
	page++;
	var make = '<div class=" page-content"><div id="page' + page.toString() + '" class="grid"></div></div>	'
	$('#flipbook').append(make);
	return page;
}

function feedUpdate(index, data){
	var makeIntro = '<div class="grid-item"><div class="feed-card card"><div class="card-image">'
	var makeImage = '<img src="' + data.full_picture + '"></div><div class="card-content">'
	var makeName = '<span class="card-title">' + data.name +'</span>' + data.description +'</div></div></div>'
	var make = makeIntro + makeImage + makeName;
	var pageId = '#page'
	if(index % 4 == 0 ){
		page = newPage(page);
	}
	pageId += page.toString();
	$(pageId).append(make);
}

function addBackCover(){
	var make
	if(page % 2 == 0){
	 make = '<div class ="hard"></div><div class ="hard"></div>'
	}
	else {
	make = '<div class ="hard"></div>'
	}
	$('#flipbook').append(make);
}

function addCover(){

	$.ajax('https://graph.facebook.com/me?fields=name&access_token=' + access_token,{
		success : function(response){
			console.log(response.name);	
			make = '<div class="hard"><div class="cover page-content"><div class="intro-card card"><div class="card-content"><span class="card-title name ">' +response.name+'\'s LookBook</span>Some cool thing I did last year</div></div></div></div><div class="hard"></div>';
			$("#flipbook").append(make);
			getImage();
		}

	});
	
}


function initFlipbook(){
	$("#flipbook").turn({
		width: 1000,
		height: 650,
		autoCenter: true
		});	
}

function finishSetup(){
	$('#modal1').modal('close');
	$('.photostack').css("visibility","visible");
	$('.position-book').css("visibility","visible");


}

$(document).ready(function() {
			place(true);
			$('#modal1').modal('open');
			
		});

$(window).resize(function(){
		place();

})

