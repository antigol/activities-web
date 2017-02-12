$(document).ready(function() {
    $("input[name='nslots']").bind('input propertychange', create_slots);
    $("#send").click(send);
    //$("input").bind('input propertychange', check_validity);
    //$("textarea").bind('input propertychange', check_validity);
    $("input[name='deadline']").datepicker({
        showOtherMonths: true,
        selectOtherMonths: true,
        dateFormat: "yy-mm-dd",
        onSelect: function() {
            //check_validity();
        },
        minDate: 0
    });
    create_slots();
    //check_validity();
});

function send() {
    if (!check_validity()) {
        return;
    }

    var slots = get_slot_val();
    var deadline = $("input[name='deadline']").datepicker("getDate");
    if (deadline === null) {
        deadline = 0;
    } else {
        deadline = deadline.getTime() / 1000 + 24 * 3600 - 60; // à 23h59
    }

    var payload = JSON.stringify({
      name : $("input[name='name']").val(),
      deadline : deadline,
      amail : $("input[name='amail']").val(),
      mails : $("#mails").val().split(/[\s,;]+/).filter(function(x) { return x !== ''; }),
      slots : slots.slot,
      vmin : slots.vmin,
      vmax : slots.vmax,
      url : window.location.origin,
      message : $("#message").val()
    });

    console.log(payload);

    $('#send').prop('disabled', true);
    $('#send').text('Request sent...');

    $.ajax({
        type: "POST",
        url: window.location.origin + "/create",
        data: payload,
        contentType: "application/json",
        success: function(data) {
            console.log("creation success " + data);
            swal("Creation succeed!", "A mail has been sent to " + $("input[name='amail']").val() + " to validate the activity.", "success");
            $('#send').prop('disabled', false);
            $('#send').text('Re create');
        },
        error: function(data) {
            console.log(data);
            swal("Oops...", "Something went wrong!\n" + data.responseText, "error");
            $('#send').prop('disabled', false);
            $('#send').text('Re create');
        },
    });
}
