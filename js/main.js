"use strict";
$(document).ready(function(){
  var BASE_URL = "http://localhost:8081";
  var currentTripId,currentFromAirport,currentToAirport;
  $("#trip_selecter").submit(function(e){
    e.preventDefault();
    var fromAirport = $("#fromAirport").val();
    var toAirport = $("#toAirport").val();
    var scriptUrl = BASE_URL+"/api/GET/trips/flights/fromAirport="+fromAirport+"&"+"toAirport="+toAirport;
    $.get(scriptUrl,function(response){
      var data = response.results;
      if(response.status==200){
        $(".trips_list").html("");
        currentTripId = response.tripId;
        data.forEach(function(singleItem){
          var html = "<div class=single_trip data-id='"+response.tripId+"'>"+
          "<div class='delete_div'><input type='button' class='deleteButton' value='delete' data-id='"+singleItem.flightId+"' /></div>"+
            "<h3  class=flight_name>"+singleItem.flightName+"</h3>"+
            "<div class=airportNameContainer>"+
              "<div class=single_name left>"+singleItem.fromAirport[0].name+"</div>"+
                "<div class=single_name right>"+singleItem.toAirport[0].name+"</div>"+
            "</div>"+
          "</div>";
          $(".trips_list").append(html);
        })

      }
      if(response.status==404){
$(".trips_list").html("");
          var html = "<h3>No results found</h3>";
          $(".trips_list").append(html);
      }

    });
  });
  var startLimit =0;
  var endLimit = 500;
  var scriptUrl = BASE_URL+"/api/GET/airports/start="+startLimit+"&end="+endLimit;
  $.get(scriptUrl,function(response){
    if(response.status==200){
      var data = response.results;
      data.forEach(function(singleItem){
        var html = "<option value='"+singleItem.airportId+"''>"+singleItem.name+"</option>";
        $("#fromAirport").append(html);
        $("#toAirport").append(html);
      });
    }
  });
$("body").on('click','.deleteButton',function(e){
  var flightId = $(this).attr('data-id');
  var tripId = $(this).closest(".single_trip").attr('data-id');
  var scriptUrl = BASE_URL+"/api/DELETE/trips/"+tripId+"/flights/delete";
  $.ajax({
    url:scriptUrl,
    type:"DELETE",
    data:{'flightId':flightId},
    success: function(result) {
      if(result.results.successful){
        alert("deleted");
      }else{
        alert(response.message);
      }
    }
  });
});
$(".overlay").on('click',function(e){
  var el =$(this);
  if(e.target.id=="overlay"){
    el.hide();
  }
});
$("#add_flight_button").on('click',function(e){
  $(".overlay").show();
});
$("#add_flight").on('submit',function(e){
  e.preventDefault();
  var fromAirport = $("#fromAirport").val();
  var toAirport = $("#toAirport").val();
  var flightName = $("#flightName").val();
  var scriptUrl = BASE_URL+"/api/POST/trips/flights/add";
  $.post(scriptUrl,{flightName:flightName,fromAirport:fromAirport,toAirport:toAirport},function(response){
    if(response.status==200){
    if(response.results.successful){
        alert("Added");
    }else{
      alert(response.message);
    }
  }else{
    alert(response.message);
  }
  $(".overlay").hide();
  });
});
});
