function startQuiz() {

  var candidates = [{id: 1, display: 'Hillary Clinton'},
    {id: 2, display: 'Bernie Sanders'}, {id: 3, display: 'Jeb Bush'},
    {id: 4, display: 'Ted Cruz'}, {id: 5, display: 'Donald Trump'},
    {id: 6, display: 'John Kasich'}, {id: 7, display: 'Chris Christie'},
    {id: 8, display: 'Ben Carson'}, {id: 9, display: 'Carly Fiorina'},
    {id: 10, display: 'Marco Rubio'}];

  var traits = [{id: 1, display: 'Honest'}, {id: 2, display: 'Trustworthy'},
    {id: 3, display: 'Experienced'}, {id: 4, display: 'Intellegent'},
    {id: 5, display: 'Principled'}, {id: 6, display: 'Pragmatic'},
    {id: 7, display: 'Idealistic'}, {id: 8, display: 'Passionate'},
    {id: 9, display: 'Outsider'}, {id: 10, display: 'Compassionate'},
    {id: 11, display: 'None of the above'}];

  var issues = [{id: 1, display: 'Immigration'},
   {id: 2, display: 'Income Inequality'}, {id: 3, display: 'Abortion'},
   {id: 4, display: 'Taxes'}, {id: 5, display: 'The National Debt'},
   {id: 6, display: 'Terrorism'}, {id: 7, display: 'Economy'},
   {id: 8, display: 'The Environment'}, {id: 9, display: 'Health care'},
   {id: 10, display: 'Criminal Justice'}, {id: 11, display: 'Education'},
   {id: 12, display: 'Privacy/Data Security'}, {id: 13, display: 'Moral Values'},
   {id: 14, display: 'Corruption in Government'}];

  var responses = {};
  var questionNumber = 0; //used as a step counter for the whole script
  var fadeDelay = 300; //time in ms for questions to transition

  $('.next').click(function() {

    //console.log(questionNumber);

    if (questionTest(questionNumber)) {
      //questionNumber++;
      console.log(JSON.stringify(responses));

      cycleQuestions(questionNumber, questionNumber + 1);
      showQuestionOptions(questionNumber);
      questionNumber++;
      $('.warning').text('');
    } else {

    }
  });


  function showQuestionOptions(q) {

    q++;

    console.log('running question: ' + q);

    if (q === 0) {

    }

    if (q === 1) {
      var traitList = randomize(traits.slice(0, traits.length - 1));
      traitList[traitList.length] = traits[traits.length - 1];
      $('.q1List').append(showList("traitList", traitList, "checkbox"));
    }

    if (q === 2) {
      var issueList = issues.slice(0);
      $('.q2List').append(showList("issueList", randomize(issueList), "radio"));
    }

    if (q === 3) {
      var candidateList = candidates.slice(0);
      $('.q3List').append(showList("candidateList", randomize(candidateList),
       "radio"));
    }

    if (q === 4) {
      var faveIssue = '';
      var faveCandidate = '';

      console.log("candidate: " + responses['prefer']);
      console.log('issue: ' + responses["issues"]);

      var issueID = Number(responses["issues"] - 1);
      faveIssue = issues[issueID].display;

      var candidateID = Number(responses["prefer"] - 1);
      faveCand = candidates[candidateID].display;

      console.log(faveIssue);
      console.log(faveCand);

      $('#faveCandidate').text(faveCand);
      $('#faveIssue').text(faveIssue.toLowerCase());
      setSlider('claritySlider');
    }

  };



  function questionTest(q) {

    if (q === 0) return true;

    if (q === 1) {
      var noneOfTheAbove = false;
      var q1Length = 0;
      $('input[name=traitList]:checked').each(function() {
        if ($(this).val()) q1Length++;
        //console.log("selected: " + $(this).val());
        if ($(this).val() == traits.length.toString())
         {
           noneOfTheAbove = true;
         }
      });

      //console.log(q1Length.toString() + " nan:" + noneOfTheAbove);

      if (q1Length > 1 && noneOfTheAbove) {
        $('.warning').text('None of the above must be selected by itself');
        return false;
      } else if (q1Length > 0 && q1Length <= 3) {

        responses["trait1"] = '';
        responses["trait2"] = '';
        responses["trait3"] = '';

        var traitCounter = 1;

        $('input[name=traitList]:checked').each( function() {
          if ($(this).val()) {
            responses["trait" + traitCounter] = $(this).val()
            traitCounter++;
          };
        });
        console.log("answer number 1: " + responses["trait1"]);
        console.log("answer number 2: " + responses["trait2"]);
        console.log("answer number 3: " + responses["trait3"]);
        return true;

      } else if (q1Length < 1) {
        $('.warning').text('Please select at least one option');
        return false;
      } else {
        $('.warning').text('Please only select up to three options');
        return false;
      }
    }

    if (q === 2) {
      if ($('input[name=issueList]:checked').val()) {
        responses["issues"] = $('input[name=issueList]:checked').val();
        return true;
      } else {
        return false;
      }
    }

    if (q === 3) {
      if ($('input[name=candidateList]:checked').val()) {
        responses["prefer"] = $('input[name=candidateList]:checked').val();
        return true;
      } else {
        return false;
      }
    }

  };


  function randomize(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  };


  function showList(name, array, selectType) {
    var html = '';

    for (var i = 0; i < array.length; i++) {
      html += "<input type='" + selectType + "' name='" + name +
      "' id='" + array[i].id.toString() + "-" + array[i].display +
      "' value='" + array[i].id + "'>" +
      "<label for='" + array[i].id.toString() + "-" + array[i].display + "'>" +
      array[i].display + "</label><br>";
    }

    return html;
  };


  function cycleQuestions(q1, q2, fadeDelay) {

    fadeDelay = 400;

    var oldQuestion = ".q" + q1;
    var newQuestion = ".q" + q2;

    //console.log('q1 out: ' + oldQuestion + " q2 in: " + newQuestion);

    $(oldQuestion).slideUp(fadeDelay);
    setTimeout(function() {
      $(newQuestion).slideDown(fadeDelay);
    }, fadeDelay + 50);

  };

};


/////////////////////////////////////////////////////////////
//sets up the labels on the slider whose class name is passed
function setSlider(name) {

 var el;
 var labelDiv = '.' + name;
 var displayed = false;


 // Select all range inputs, watch for change
 $("input[name='" + name + "']").change(function() {

   // Cache this for efficiency
   el = $(this);

   // Measure attributes of the slider
   sliderWidth = el.width();
   max = Number(el.attr('max'));
   min = Number(el.attr('min'));
   step = Number(el.attr('step'));
   labelWidth = sliderWidth / ((max - min) * step);



/*
   console.log('sliderWidth: ' + sliderWidth);
   console.log('max: ' + max);
   console.log('min: ' + min);
   console.log('step: ' + step);
   console.log('labelWidth: ' + labelWidth);
   console.log('labelDiv: ' + labelDiv);
*/


  if (!displayed) {

    /*
    $(labelDiv).css({marginLeft: "-=" + parseInt((labelWidth / 2) - 8) + "px",
      width: "+=" + (labelWidth + 5) + "px"});
    */

    $(labelDiv).css({left: "-=" + parseInt((labelWidth / 2)) + "px",
      width: "+=" + (labelWidth - 16) + "px"});

    for (var i = min; i <= max; i += step) {

      $(labelDiv).append('<div class="sliderLabel" style="width: ' +
      ((labelWidth * .97)) + 'px;" id="' + name + i + '">' + i.toString() + "<br>|</div>");
    }
    displayed = true;

  }

   //highlights the label that the slider is on
   for (var i = min; i <= max; i += step) {

     var labelID = '#' + name + i;

     if (Number($("input[name='" + name + "']").val()) === i) {
       $(labelID).addClass('sliderLabelOn');
     } else {
       $(labelID).removeClass('sliderLabelOn');
     }
   }

 })
 // Fake a change to position bubble at page load
 .trigger('change');
};

startQuiz();