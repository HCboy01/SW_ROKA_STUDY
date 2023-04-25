$ ('document').ready(function(){
	
	//-------------코드에 사용될 데이터 미리 정의 --------------
	// 공의 개수
	var circleNumber = 0;
	
	// 공의 속성 (지름(반지름), 색깔, 속도)
	var circleTypes = {
		'option': ['color', 'width', 'border-radius', 'speed'],
		'small': ['black', 5, 2.5, 3000],
		'medium': ['blue', 15, 7.5, 4000],
		'large': ['yellow', 30, 15, 5000]
	};
	
	// 초기 시간
	var t = 0;
	
	// 게임 실행 여부
	var gameOn = false;
	
	// 마우스 좌표
	var mouseX;
	var mouseY;
	
	//------------------------------------------------------
	
	// 마우스 위치 인식해서 좌표에 대입해주는 함수
	$('body').mousemove(function(){
		mouseX = event.pageX;
		mouseY = event.pageY;		
	});
	
	// 타이머
	var timer = function(){
		//test code
		//gameOn = true
		if (gameOn == true){
			setTimeout(function(){
				t = t + 0.01;
				$('.timer').html(`<h1><div class = 'center'>${t.toFixed(2)}</div></h1>`);
				timer();
			}, 10);
		};
	};
	//test code
	//timer();
	
	$('.startbutton').click(function(){
		$('.startbutton').fadeToggle(500,function(){
			gameOn = true;
			timer();
			
			//마우스가 영역 밖으로 나가면
			$('.space').mouseenter(function(){
				//게임 끝내는 함수
				endGame();
			});
			
			//공 생성 함수
			createBall();
		});
	});
	
	//공을 생성해주는 함수
	var createBall = function(){
		circleNumber ++;
		
		var ballId = 'ball' + circleNumber; 
		
		var randNum = Math.floor(3* Math.random() + 1)
		console.log(randNum)
		if (randNum == 1){
			var ballType = 'small'
		}else if (randNum == 2){
			var ballType = 'medium'
		}else {
			var ballType = 'large'
		}
		
		console.log(ballType)
		var ballColor = circleTypes[ballType][0];
		var ballWidth = circleTypes[ballType][1];
		var ballRadius = circleTypes[ballType][2];
		var ballSpeed = circleTypes[ballType][3];

		// 공이 움직일 수 있는 범위 지정
		var moveableX = $('body').width() - ballWidth;
		var moveableY = $('body').height() - ballWidth;
		
		
		// 공의 초기 위치 지정
		var beginningPosiLeft = (Math.random() * moveableX).toFixed();
		var beginningPosiTop = (Math.random() * moveableY).toFixed();

		// HTML, CSS에 새 공 추가하기
		var newBall = `<div class = 'ball' id = '${ballId}'></div>`
		$('body').append(newBall);
		
		
		$("#"+ballId).css({
			'background-color' : ballColor,
			'width' : ballWidth + 'vmin',
			'height' : ballWidth + 'vmin',
			'border-radius' : ballRadius + 'vmin',
			'top' : beginningPosiTop + 'px',
			'left' : beginningPosiLeft + 'px',
		});
		
		// 1ms 마다 공과 마우스의 거리를 계산하는 함수
		var calDistance = function(curBallId){
			setTimeout(function(){
				// --- 필요한 변수 ---
				// 현재 공의 위치
				var curBallPosi = $('#'+curBallId).position();
				// 현재 마우스의 위치 (계산되어 있음)
				// 공과 마우스 사이의 거리
				var distanceX = (curBallPosi.left + parseInt($('#'+curBallId).css('border-radius'))) - mouseX;
				var distanceY = (curBallPosi.top + parseInt($('#'+curBallId).css('border-radius'))) - mouseY;
				// -----------------
				
				if (Math.pow(distanceX,2)+Math.pow(distanceY,2) <= Math.pow(parseInt($('#'+curBallId).css('border-radius')),2)){
					//게임 끝내고, 부딪힌 공 빨간색으로 표시
					$('#'+curBallId).removeClass('ball').addClass('redball')
					$('#'+curBallId).css('background-color','red')
					endGame();
				}
				else{
					calDistance(curBallId)
				}
			},1)
		}
		calDistance(ballId);
		

		animateBall(ballId, ballSpeed,moveableX,moveableY);
		
		
        setTimeout(function () {
			if (gameOn == true){
	            createBall();
			}
        }, 3000);
	};
	
	
	var animateBall = function(curBallId,speed,moveableX,moveableY){
		var targetX = (Math.random() * moveableX).toFixed();
		var targetY = (Math.random() * moveableY).toFixed();
		
		console.log(curBallId,speed,targetX)
		$('#'+curBallId).animate({
			left : targetX,
			top : targetY
		},speed,function () {
        animateBall(curBallId, speed,moveableX,moveableY);
 		});	
	}
	
	
	var scoreList = ['0.00','0.00','0.00','0.00','0.00']
	
	var endGame = function(){
		if (gameOn == true){
			gameOn = false;
			$('.ball').remove();
			$('.redball').stop();
			$('#highscores').css('display','block');
			$('#highscores').append(`<h2 class = 'center' style = 'color:red'>${t.toFixed(2)}<h2>`);
			scoreList.push(t.toFixed(2))
			console.log(scoreList)
			scoreList.sort(function(a, b) {
				return b-a;
			});
			
			for (var i = 0; i < 5; i++){
				$('#highscores').append(`<h2 class = 'center'>${scoreList[i]}<h2>`);
			}
			$('#highscores').append(`<div class = 'resetbutton'>
										<h2 class = 'center'>Try Again</h2>
									</div>`);		
			
			$('.resetbutton').click(function(){
				restart();
			})
			
		}
	}
	
	var restart = function(){
		console.log(1)
		t = 0.00
		$('.timer').html(`<h1><div class = 'center'>${t.toFixed(2)}</div></h1>`);
		$('.redball').remove();
		$('.resetbutton').remove();
		$('#highscores').html(`<h1>
				<div class = 'center'>Game Over</div>
			</h1>`)
		$('#highscores').css('display','none');
		$('.startbutton').toggle();
	}
	

	
})
