
$(document).ready(function(){ // <--  IS THIS NECESSARY IF JS HAS OWN FILE?
	function xyz() {
		console.log(1);
		foo()
		console.log(2);
	}
	
	function foo() {
		console.log(3)
		bar()
		console.log(4)
	}

	function bar() {
		console.log(5)
	}
	xyz();
		// The taskHtml method takes in a Jacascript representation
		// of the task and produces an HTML representation using
		// <li> tags

		function taskHtml(task) {
			var checkedStatus = task.done ? "checked" : "";
			var liClass = task.done ? "completed" : "";
			
			var liElement = '<li id="listItem-' + task.id + '" class="' + liClass + '">' +
			'<div class="view"><input class="toggle" type="checkbox"' + " data-id='" +
			task.id + "'" + checkedStatus + ' /><label>' + task.title + 
			'</label><a class="destroy" rel="nofollow" data-method="delete" href="/tasks/' + task.id + 
			'"></a></div></li>';

			return liElement;	

		}

		// toggleTask takes in an HTML representation of 
		// an event that fires from an HTML representation of
		// the toggle checkbox and performs an API request to toggle
		// the value of the 'done' field

		function toggleTask(e) {
			var itemId = $(e.target).data("id");

			var doneValue = Boolean($(e.target).is(':checked'));

			$.post("/tasks/" + itemId, {
				_method: "PUT",
				task: {
					done: doneValue
				}
			}).success(function(data) {
				var liHtml = taskHtml(data);
				var $li = $("#listItem-" + data.id);
				$li.replaceWith(liHtml);
				$('.toggle').change(toggleTask);
			} );
		}

		
		function deleteTask(e) {
			e.preventDefault();

			var itemId = $(e.target).data("id");

			$.ajax("/tasks/" + itemId, {
				_method: "DELETE",
			}).success(function(data) {
				var liHtml = taskHtml(data);
				var $li = $("#listItem-" + data.id);
				$li.replaceWith('');
			} );
		}
	

		$.get("/tasks").success( function( data ) {
			var htmlString = "";
			$.each(data, function(index, task) {
				htmlString += taskHtml(task);
			});

			var ulTodos = $('.todo-list');
			ulTodos.html(htmlString);

			$('.toggle').change(toggleTask);

			$('.destroy').click(deleteTask);
		});



		$('#new-form').submit(function(event) {
			event.preventDefault();
			var textbox = $('.new-todo');
			var payload = {
				task: {
					title: textbox.val()
				}
			}
			$.post("/tasks", payload).success(function(data) {
				var htmlString = taskHtml(data);
				var ulTodos = $('.todo-list');
				ulTodos.append(htmlString);
				$('.toggle').click(toggleTask);
				$('.new-todo').val('');
			});
		});

});