function main() {
	const form = document.querySelector('#form');
	const selection = document.querySelector('select[name="type"]');
	selection.addEventListener('change', function(evt){
		const toChange = document.querySelectorAll('input');
		const textArea = document.querySelector('textarea');
		const formBullet = document.querySelector('#form-bullet');
		formBullet.removeAttribute('class');

	    for(let i=0; i<toChange.length; i++){
	    	form.removeChild(toChange[i]);
	    }
	    if(textArea){
	    	form.removeChild(textArea);
	    }
		
		if (selection.value === 'task'){
			const newNode = document.createElement('input');
			newNode.setAttribute('type', 'text');
			newNode.setAttribute('name', 'content');
			newNode.setAttribute('placeholder', 'Content');
			form.appendChild(newNode);
			formBullet.setAttribute('class', 'task');
		}
		else if (selection.value === 'event'){
			const datePicker = document.createElement('input');
			datePicker.setAttribute('type', 'date');
			datePicker.setAttribute('name', 'date');

			const newNode = document.createElement('input');
			newNode.setAttribute('type', 'text');
			newNode.setAttribute('name', 'content');
			newNode.setAttribute('placeholder', 'Content');

			form.appendChild(datePicker);
			form.appendChild(newNode);
			formBullet.setAttribute('class', 'event');
		}
		else{
			const newNode = document.createElement('textarea');
			newNode.setAttribute('name', 'content');
			newNode.setAttribute('placeholder', 'Content');

			form.appendChild(newNode);
			formBullet.setAttribute('class', 'note');
		}

		const submit = document.createElement('input');
		submit.setAttribute('type', 'submit');
		submit.setAttribute('value', 'Add New Item');
		form.appendChild(submit);
	});
}

document.addEventListener('DOMContentLoaded', main);