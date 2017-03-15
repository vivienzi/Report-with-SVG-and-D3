$(function() {
    // Bootstrap DateTimePicker v4
    $('#datetimepicker1').datetimepicker({
        format: 'YYYY-MM-DD'
    });
});


$(document).ready(function(){
  $("input").on("change",function(){
    var date = $("input").value;
    $(".pickdate").text(date);
    alert("test");
  })
});
