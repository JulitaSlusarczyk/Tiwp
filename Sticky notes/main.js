$(document).ready(function()
{

    $('#addNew').click(function()
    {
        addNewRow();
    });

    $('#refreshNotes').click(function()
    {
        refreshNotes();
    });

    $('.deleteButton').click(function()
    {
        deleteRow($(this));
    });
    refreshNotes();
});

function addNewRow()
{   
    var tytul = window.prompt("Podaj tytul notatki: ",""); //pojawienie sie okna na tytul

    if (tytul != null && tytul != "") //sprawdza czy uzytkownik podal tytul, jak nie, to notatka nie jest dodawana
    {
        var tresc = window.prompt("Podaj tresc notatki "+tytul,""); //pojawienie sie okna na tresc notatki

        if(tresc != null && tresc != "") //sprawdza czy uzytkownik podal tresc notatki, jak nie, to notatka nie jest dodawana
        {
        var numRows = $('#newTasks tr').length;
        $('#newTasks').append('<tr><td><input type="text" id="title-'+numRows+'"value="'+tytul+'" /></td><td><input type="text" id="description-'+numRows+'" value="'+tresc+'" /></td><td><a class="deleteButton" id="delete-'+numRows+'" title="Delete Task" style="color:red;">X</a></td></tr>')
        refreshNotes(); //od razu dodaje ta nowa notatke
        $('.deleteButton').click(function()
            {
                deleteRow($(this));
            });
        //edycja nowo dodanego elementu
        edit("title-"+numRows);
        edit("description-"+numRows);
        edit("delete-"+numRows);
        }
    }
}

function refreshNotes()
{

    var tableRows = $('#newTasks tr');

    $('.sticky_notes li').remove();

    $.each(tableRows,function(i)
    {
        var title = $(this).find('input[id^="title"]').val();
        var description = $(this).find('input[id^="description"]').val();

        if(title != undefined && description != undefined)
        {
            createNotes(title, description);
        }   
    });
}

function createNotes(title, description)
{
    var header = '<h2>'+title+'</h2>';
    var desc = '<p>'+description+'</p>';

    var colours = new Array();
    colours[0] = 'green';
    colours[1] = 'blue';
    colours[2] = 'yellow';
    colours[3] = 'red';
    colours[4] = 'purple';
    colours[5] = 'orange';

    var emoji = new Array();
    emoji[0]= '๏̯͡๏﴿';
    emoji[1]='(｡◕‿◕｡)';
    emoji[2]='◔̯◔';
    emoji[3]='٩(●̮̮̃•̃)۶';
    emoji[4]='(▰˘◡˘▰)';
    emoji[5]='( ＾◡＾)';
    emoji[6]='(°∀°)';

    $('.sticky_notes').append('<li class="'+colours[randomFromTo(0,(colours.length - 1))]+'">'+header+emoji[randomFromTo(0,(emoji.length - 1))]+description+'</li>');
}

function randomFromTo(from, to)
{
    return Math.floor(Math.random() * (to - from + 1) + from);
}

function deleteRow(thisButton)
{
    thisButton.parent().parent().remove();
    refreshNotes()
}

function edit(id)
{
    //edycja pola input, ponowne zaladowanie notatek po naciśnieciu entera
    var edit = document.getElementById(id);

    edit.addEventListener("keyup", function(event) 
    {
        event.preventDefault();

        if (event.keyCode === 13) 
        {
            refreshNotes();
        }
    });
}