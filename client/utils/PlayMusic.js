const TouChAudio = wx.createInnerAudioContext(),//点击
      PressAudio = wx.createInnerAudioContext(),//按下
      PassAudio= wx.createInnerAudioContext(),//通过
      PromptAudio = wx.createInnerAudioContext(),//提示
      FailureAudio = wx.createInnerAudioContext();//失败

  function play(index){
    if (index == 0) {
       TouChAudio.src = "/mp3/点击音效01.mp3";
       TouChAudio.play();
    }else if(index == 1){
       PressAudio.src = "/mp3/点击音效02.mp3";
       PressAudio.play();
    }else if(index == 2){
       PassAudio.src = "/mp3/过关音效.mp3";
       PassAudio.play();
    }else if(index == 3){
       PromptAudio.src = "/mp3/题目错误.mp3";
       PromptAudio.play();
    }else{
       FailureAudio.src = "/mp3/失败音效01.mp3";
       FailureAudio.play();
    }
  }

module.exports = {
 
 play:play

}


