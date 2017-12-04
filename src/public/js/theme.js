function main() {
	const radio = document.querySelectorAll('input[type="radio"]');
	for(const r in radio){
		radio[r].onclick = function(){
			const theme = document.querySelector('.bootstrap');
			const newTheme = document.createElement('link');
			newTheme.setAttribute('class', 'bootstrap');
			newTheme.setAttribute('rel', 'stylesheet');
			if (this.value === 'original'){
				newTheme.setAttribute('href', '../../bootstrap-original/css/bootstrap.min.css');	
			}
			if (this.value === 'color'){
				newTheme.setAttribute('href', '../../bootstrap-color/css/bootstrap.min.css');	
			}
			if (this.value === 'dark'){
				newTheme.setAttribute('href', '../../bootstrap-dark/css/bootstrap.min.css');	
			}
			theme.parentNode.insertBefore(newTheme, theme);
			theme.parentNode.removeChild(theme);
		};
	}
}

document.addEventListener('DOMContentLoaded', main);