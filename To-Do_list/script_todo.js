
if (typeof(Storage) === "undefined") alert("LocalStorage no soportado en este navegador!");
//PONER ID BOTON CLASS
if(localStorage.getItem("tareas_realizadas") == null){
	var tareas_realizadas = [];
}else{
	var tareas_realizadas = JSON.parse(localStorage.getItem("tareas_realizadas"));
}

if(localStorage.getItem("tareas") == null){
	var tareas = [];
}else{	
	var tareas = JSON.parse(localStorage.getItem("tareas"));
	for (var i = 0 ; typeof(tareas[i]) !== 'undefined'; i++) {
		//if (tareas_realizadas[i]=='undefined') {tareas_realizadas[i]=false}
		agregar_tarea(tareas[i],i);
	}
}
$(document).ready(function(){
	$("#tabla_tareas").hide();
	$("#string_nueva_tarea").hide();
	$("#boton_nueva_tarea").hide();
	$("#tabla_tareas").fadeIn(800);
	$("#string_nueva_tarea").fadeIn(800);
	$("#boton_nueva_tarea").fadeIn(800);
});

	document.getElementById('boton_nueva_tarea').onclick = nueva_tarea;

	function agregar_tarea(string_tarea,nro_tarea){
		if(string_tarea==null)return;
		var tr = document.createElement("tr");
		var td = document.createElement("td");
		td.setAttribute("class","tarea");
		td.innerHTML = string_tarea;
		if(tareas_realizadas[nro_tarea]==true) td.style.color = "green";
		tr.appendChild(td);
		
		td = document.createElement("td");

		if(!tareas_realizadas[nro_tarea]){
			var img = document.createElement("img");
			img.setAttribute("class","checked_green botones");
			img.setAttribute("src","checked_green.png");
			td.appendChild(img);
		}

		if(!tareas_realizadas[nro_tarea]){
			var img = document.createElement("img");
			img.setAttribute("class","lapiz_edit botones");
			img.setAttribute("src","lapiz_edit.png");
			td.appendChild(img);
		}

		var img = document.createElement("img");
		img.setAttribute("class","red_trash_can botones");
		img.setAttribute("src","red_trash_can.png");
		td.appendChild(img);

		if(!tareas_realizadas[nro_tarea]){
			var input = document.createElement('input');
			input.setAttribute("class","modificar boton");
			input.setAttribute("type","button");
			input.setAttribute("value","Modificar");
			input.style.display = "none";
			td.appendChild(input);
		}
		tr.appendChild(td);
		tr.appendChild(document.createElement("br"));
		document.getElementById("tabla_tareas").appendChild(tr);
	};

	function eliminar_tarea(tarea_a_eliminar){
	for (var i = 0 ; typeof(tareas[i]) !== 'undefined'; i++) {
		if(tareas[i] === tarea_a_eliminar){
			delete tareas[i];
			delete tareas_realizadas[i];
			localStorage.setItem("tareas",JSON.stringify(tareas));
			localStorage.setItem("tareas_realizadas",JSON.stringify(tareas_realizadas));
			return;
		}
	}

	};

	function agregar_tarea_modificada(tarea_modif,nro_tarea){
		tareas[nro_tarea] = tarea_modif;
		localStorage.setItem("tareas",JSON.stringify(tareas));
	};

	function nueva_tarea(){
		if(document.getElementById("string_nueva_tarea").value == ""){
			alert("ingrese una tarea primero"); 
			return;
		}
		tareas.push(document.getElementById("string_nueva_tarea").value);
		var nro_tarea = buscar_tarea(document.getElementById("string_nueva_tarea").value);
		$("#string_nueva_tarea").val("");
		localStorage.setItem("tareas",JSON.stringify(tareas));

		tareas_realizadas[nro_tarea]=false;
		localStorage.setItem("tareas_realizadas",JSON.stringify(tareas_realizadas));
		location.reload();
	};

	function buscar_tarea(tarea){
		for (var i = 0 ; typeof(tareas[i]) !== 'undefined'; i++) {
			if(tareas[i] === tarea){
				return i;
			}
		}
	}

$(".lapiz_edit").click( function(ev){
	var tarea = $(this).parent().siblings("td.tarea").html();

for (var i = 0 ; typeof(tareas[i]) !== 'undefined'; i++) {
	if(tareas[i] === tarea){
		$(this).parent().siblings("td.tarea").html("");
		var input = document.createElement('input');
		input.setAttribute("type","hidden");
		input.setAttribute("value",i);
		$(this).parent().siblings("td.tarea").append(input);
		
		var input = document.createElement('input');
		input.setAttribute("type","text");
		input.setAttribute("value",tarea);		
		$(this).parent().siblings("td.tarea").append(input);
	}
}
	$(this).parent().siblings("td.tarea").children("input[type='text']").hide();
	$(this).parent().siblings("td.tarea").children("input[type='text']").fadeIn();
	$(this).parent().siblings("td.tarea").children("input[type='text']").focus().select();

	$(this).parent().children('.botones').hide();
	$(this).parent().children(".modificar").fadeIn();

});

$(".red_trash_can").click(function(){
	if (confirm('Estas seguro que quieres eliminar esta tarea?')) {
		eliminar_tarea($(this).parent().siblings("td.tarea").html());
		$(this).parent().parent().remove(); 
	}
});

$(".checked_green").click(function(ev){
	if(!confirm('Realmente completo la tarea?')) return;
	$(this).parent().siblings("td.tarea").css("color","green");
	var nro_tarea=buscar_tarea($(this).parent().siblings("td.tarea").html());

	tareas_realizadas[nro_tarea]=true;
	localStorage.setItem("tareas_realizadas",JSON.stringify(tareas_realizadas));

	$(this).parent().children('.botones').hide();
	$(this).parent().children('.red_trash_can').fadeIn();
});

$(".modificar").click(function(ev){
	var tarea_modif = $(this).parent().siblings("td.tarea").children('input[type=text]').val();
	var nro_tarea = $(this).parent().siblings("td.tarea").children('input[type=hidden]').val();
	agregar_tarea_modificada(tarea_modif,nro_tarea);
	$(this).parent().siblings("td.tarea").children('input').remove();
	$(this).parent().siblings("td.tarea").html(tarea_modif);

	$(this).parent().children('input[type=button]').hide();
	$(this).parent().children('.botones').fadeIn();
});