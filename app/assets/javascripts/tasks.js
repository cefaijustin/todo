$(function(){
		// The taskHtml method takes in a Jacascript representation
		// of the task and produces an HTML representation using
		// <li> tags
		function taskHtml(task) {
			var checkedStatus = task.done ? "checked" : "";
			var liClass = task.done ? "completed" : "";

			  var liElement = '<li id="listItem-' + task.id + '" class="' + liClass + '">' +
			  '<div class="view"><input class="toggle" type="checkbox"' + " data-id='" +
			  task.id + "'" + checkedStatus + ' /><label>' + task.title +
			  '</label><a data-confirm="Are you sure you want to delete this?" ' + 
			  'class="destroy" rel="nofollow" data-method="delete" href="/tasks/' + task.id + 
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

		$.get("/tasks").success( function( data ) {
			var htmlString = "";
			$.each(data, function(index, task) {
				htmlString += taskHtml(task);
			});

			var ulTodos = $('.todo-list');
			ulTodos.html(htmlString);

			$('.toggle').change(toggleTask);
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
	
			$.delete("/tasks" + itemId, {
				_method: "DELETE",
				task: {
					done: delteValue
				}
			}).click(function(event) {
  			var liHtml = taskHtml(data);
				var $li = $("#listItem-" + data.id);
				$li.replaceWith(liHtml);
				$('.delete').delete(toggleTask);
			} );

});