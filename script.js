var crudApp = new function() {
	
	// -------프로젝트에 쓰일 데이터들--------
	// 수강 데이터를 담을 Json 형식의 배열 만들기
	this.myClass = [
		{ID: '1', Class_Name: '운영체제', Category: '전공필수', Credit: 3 },
		{ID: '2', Class_Name: '컴퓨터구조론', Category: '전공선택', Credit: 4 },
		{ID: '3', Class_Name: '심리학의 이해', Category: '전공필수', Credit: 2 },
	]
	// 선택할 수 있는 항목 미리 정의
	this.Category = ['전공필수', '전공선택', '교양필수', '교양선택'];
	
	//Table Header에 담길 데이터를 확장성(데이터가 추가되면서 형식이 추가될 수 있으므로)을 위해 배열에 담기
	this.col = [];
	
	//------------------------------------
	
	// 위 데이터들을 토대로 실제로 테이블을 만드는 메서드
	this.createTable = () => {
		// 테이블을 만들고 데이터를 채우는 코드
		
		
		// col에 table header에 해당하는 데이터 (myClass의 key 값들)을 넣어주는 코드
		for (var i = 0; i < this.myClass.length; i++){
			// 각 객체들 속 키 값을 순회
			for (var key in this.myClass[i]){
				 // key를 col 배열에 담자 (indexOf => 문자열속의 문자를 검색)
				if (this.col.indexOf(key) === -1) this.col.push(key)
			}
		}
		
		// -------------------------------
		var table = document.createElement('table');
		table.setAttribute('id', 'classTable');
		
		// tr: 새로운 행 추가
		var tr = table.insertRow(-1);
		
		// th를 작성
		for(var h = 0; h < this.col.length; h++){
			var th = document.createElement('th');
			th.innerHTML = this.col[h];
			tr.appendChild(th);
		}
		
		// tr 만들기
		for(var i = 0; i < this.myClass.length; i++){
			tr = table.insertRow(-1);
			for (var j = 0; j < this.col.length; j++){
				var tabCell = tr.insertCell(-1);
				tabCell.innerHTML = this.myClass[i][this.col[j]];
			}

			// 버튼 만들기
			// update 버튼
			this.td = document.createElement('td');
			tr.appendChild(this.td);
			var btUpdate = document.createElement('input');
			btUpdate.setAttribute('type', 'button');
			btUpdate.setAttribute('value', 'Update');
			btUpdate.setAttribute('id', 'Edit'+i);
			btUpdate.setAttribute('style', 'background-color: #44CCEB');
			btUpdate.setAttribute('onclick', 'crudApp.Update(this)')
			this.td.appendChild(btUpdate);
			
			// save 버튼
			tr.appendChild(this.td);
			var btSave = document.createElement('input');
			btSave.setAttribute('type', 'button');
			btSave.setAttribute('value', 'Save');
			btSave.setAttribute('id', 'Save'+i);			
			btSave.setAttribute('style', 'display:none');
			btSave.setAttribute('onclick', 'crudApp.Save(this)')
			this.td.appendChild(btSave);
			
			// delete 버튼
			this.td = document.createElement('td');
			tr.appendChild(this.td);
			var btDelete = document.createElement('input');
			btDelete.setAttribute('type', 'button');
			btDelete.setAttribute('value', 'Delete');
			btDelete.setAttribute('id', 'Edit'+i);
			btDelete.setAttribute('style', 'background-color: #ED5650');
			btDelete.setAttribute('onclick', 'crudApp.Delete(this)')
			this.td.appendChild(btDelete);
			
		}
		
		// tr 밑에 새로운 행 추가 하기
		tr = table.insertRow(-1);
		for (var i = 0; i < this.col.length; i++){
			var newCell = tr.insertCell(-1);
			if (i >= 1){
				if(i == 2){
					var select = document.createElement('select');
					select.innerHTML = `<option value = ''></option>`;
					
					for (var j = 0; j < this.Category.length; j++){
						select.innerHTML = select.innerHTML +
							`<option value = '${this.Category[j]}'>${this.Category[j]}</option>`;
					}
					newCell.appendChild(select);
				}
				else{
					var tBox = document.createElement('input');
					tBox.setAttribute('type', 'text');
					tBox.setAttribute('value', '');
					newCell.appendChild(tBox);
				}
			}
		}
		this.td = document.createElement('td');
		tr.appendChild(this.td);
		var btCreate = document.createElement('input');
		btCreate.setAttribute('type', 'button');
		btCreate.setAttribute('value', 'Create');
		btCreate.setAttribute('id', 'New'+i);
		btCreate.setAttribute('style', 'background-color: #207DD1');
		btCreate.setAttribute('onclick', 'crudApp.Createnew(this)')
		this.td.appendChild(btCreate);
		
		
		
		var div = document.getElementById('container');
		div.innerHTML = '수강관리 앱';
		div.appendChild(table);
		
		

	}
	
	this.Delete = (oBotton) => {
		//console.log(oBotton)
		var targetIdx = oBotton.parentNode.parentNode.rowIndex;
		//console.log(targetIdx)
		this.myClass.splice((targetIdx-1),1)
		this.createTable();
	}
	
	this.Createnew = (oBotton) => {
		var targetIdx = oBotton.parentNode.parentNode.rowIndex;
		var trData = document.getElementById('classTable').rows[targetIdx];
		
		var obj = {}
		for (var i = 1; i < this.col.length; i++){
			var td = trData.getElementsByTagName('td')[i];
			//console.log(td)
			
			if (td.childNodes[0].getAttribute('type') == 'text' || td.childNodes[0].tagName == 'SELECT'){
				var txtVal = td.childNodes[0].value;
				//console.log(txtVal)	
				
				if (txtVal == ' '){
					alert('모든 칸을 입력해주세요!');
				}
				else{
					obj[this.col[i]] = txtVal;
				}
			}
		}
		obj[this.col[0]] = this.myClass.length + 1;
		this.myClass.push(obj);
		
		this.createTable();
	}
	
	this.Update = (oBotton) => {
		var writtenIdx = oBotton.parentNode.parentNode.rowIndex;
		var trData = document.getElementById('classTable').rows[writtenIdx];
		
		for (var i = 1; i < this.col.length; i ++){
			var td = trData.getElementsByTagName('td')[i];
			if (i == 2){
				var select = document.createElement('select');
				select.innerHTML = `<option value = "${td.innerText}">${td.innerText}</option>`;
				for (var j = 0; j < this.Category.length; j++){
					select.innerHTML = select.innerHTML + `<option value = '${this.Category[j]}'>${this.Category[j]}</option>`;
				}
			td.innerText = '';
			td.appendChild(select);
			}
			else {
				var input = document.createElement('input');
				input.setAttribute('type', 'text');
				input.setAttribute('value', td.innerText);
				td.innerText = '';
				td.appendChild(input);
			}
		}
		var btSave = document.getElementById('Save' + (writtenIdx-1));
		btSave.setAttribute('style','display: block; background-color: #2DBF64');
		
		oBotton.setAttribute('style', 'display: None');
	}
	
	this.Save = (oBotton) => {
		var writtenIdx = oBotton.parentNode.parentNode.rowIndex;
		var trData = document.getElementById('classTable').rows[writtenIdx];
		
		for (var i = 1; i < this.col.length; i++){
			var td = trData.getElementsByTagName('td')[i];
			if (td.childNodes[0].getAttribute('type') == 'text' || td.childNodes[0].tagName == 'SELECT'){
				this.myClass[writtenIdx-1][this.col[i]] = td.childNodes[0].value;
			}
		}
		this.createTable();
	}

}

crudApp.createTable();