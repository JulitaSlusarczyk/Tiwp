$('#start').click(function()
{
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	var w = $("#canvas").width();
	var h = $("#canvas").height();
	
	var cw = 15;
	var direction;
    var food1;
    var food2;
    var wynik=0;
    var czas=100;
    var stop=false;
    var n=1;
	
    var snake_array; 
    
    $('#poczatek').css('display','none');
    $('.wyniki').css('visibility','visible');
	
	function init()
	{
		direction = "right"; //początkowy kierunek
		create_snake();
		create_food(); 
		
		if(typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(paint, czas);
	}
	init();
	
	function create_snake()
	{
		var length = 5; //poczatkowa dlugosc weza
		snake_array = [];
		for(var i = length-1; i>=0; i--)
		{
			snake_array.push({x: i, y:0});
		}
	}
	
	function create_food()
	{
		food1 = {
			x: Math.round(Math.random()*(w-cw)/cw), 
			y: Math.round(Math.random()*(h-cw)/cw), 
        };
        food2 = {
			x: Math.round(Math.random()*(w-cw)/cw), 
			y: Math.round(Math.random()*(h-cw)/cw), 
        };
        notSnake(); //sprawdzenie czy jedzenie nie pojawilo sie w miejscu, gdzie znajduje sie waz
    }
    
    function notSnake()
    {
        for(var i = 0; i<snake_array.length; i++)
        {
            if(snake_array[i].x == food1.x && snake_array[i].y == food1.y || snake_array[i].x == food2.x && snake_array[i].y == food2.y)
            {
                create_food();
                break;
            }
        }
    }
	
	function paint()
	{
		//obramowanie, białe wypełnienie, czarna ramka
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, w, h);
		ctx.strokeStyle = "black";
		ctx.strokeRect(0, 0, w, h);
		
		var nx = snake_array[0].x;
		var ny = snake_array[0].y;
		
		if(direction == "right") nx++;
		else if(direction == "left") nx--;
		else if(direction == "up") ny--;
		else if(direction == "down") ny++;
		
		if(nx == -1 || nx == w/cw || ny == -1 || ny == h/cw || check_collision(nx, ny, snake_array))
		{
            //koniec gry
            var imie = window.prompt("Koniec gry! Otrzymales " + wynik + " pkt. Wpisz swoje imie: ","");
            if(imie==null || imie=="") imie="Nieznany";
            $('.wyniki').append("<li>"+n+". "+imie+" "+wynik+"pkt"+'</li>');
            n++;

            //restart gry
            wynik = 0;
            czas = 100;
			init();
			return;
		}
		
		if(nx == food1.x && ny == food1.y)
		{
            //standardowe jedzenie, dodaje 2 punkty
			var tail = {x: nx, y: ny};
            wynik+=2;
            faster();
			create_food();
        }
        else if(nx == food2.x && ny == food2.y)
		{
            //lepsze jedzenie, dodaje 5 punktow
			var tail = {x: nx, y: ny};
            wynik+=5;
            faster();
			create_food();
		}
		else
		{
			var tail = snake_array.pop();
			tail.x = nx; tail.y = ny;
		}
		
		snake_array.unshift(tail);
		
		for(var i = 0; i < snake_array.length; i++)
		{
			var c = snake_array[i];
			paint_cell(c.x, c.y,"blue");
        }
        
        var wynik_txt = "Wynik: " + wynik;
		ctx.fillText(wynik_txt, 5, h-5);
        paint_cell(food1.x, food1.y,"green");
        paint_cell(food2.x, food2.y,"yellow");
	}
	
	function paint_cell(x, y, color)
	{
		ctx.fillStyle = color;
		ctx.fillRect(x*cw, y*cw, cw, cw);
		ctx.strokeStyle = "white";
		ctx.strokeRect(x*cw, y*cw, cw, cw);
	}
	
	function check_collision(x, y, array)
	{
		for(var i = 0; i < array.length; i++)
		{
			if(array[i].x == x && array[i].y == y)
			 return true;
		}
		return false;
    }
    
    function faster()
    {
        if(czas>75) {
            clearInterval(game_loop);
            czas=czas-2;
            game_loop = setInterval(paint, czas);
        }
        else if(czas>50) {
            clearInterval(game_loop);
            czas=czas-1;
            game_loop = setInterval(paint, czas);
        }
    }

    function zapisz(wynik) {
        localStorage.setItem("wynik"+nr,imie+" "+wynik);
    }
	
	$(document).keydown(function(e){
		var key = e.which;
        
        if(stop==false) //nie może zmienić kierunku, kiedy gra jest zatrzymana
        {
		    if(key == "37" && direction != "right") direction = "left";
		    else if(key == "38" && direction != "down") direction = "up";
		    else if(key == "39" && direction != "left") direction = "right";
            else if(key == "40" && direction != "up") direction = "down";
        }
        if(key == "32") //zatrzymanie gry poprzez naciśnięcie spacji
        {
            if(stop==false)
            {
                clearInterval(game_loop);
                stop=true;
            }
            else if(stop==true)
            {
                game_loop = setInterval(paint, czas);
                stop=false;
            }
        }
        if(key == "78") //nowa gra po naciśnięciu "n"
        {
            wynik = 0;
            czas = 100;
            init();
        }
	})
	
})