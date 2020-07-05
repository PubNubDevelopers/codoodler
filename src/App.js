import React, { useRef, useEffect, useState } from 'react';
import PubNub from "pubnub";
import './App.css';


function App() {
  const [plots, setPlots] = useState([]);
  const [messages, setMessages] = useState([]);
  const canvasRef = useRef(null)
  const contextRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  //setup pubnub here
  const pubnub = new PubNub({
     publishKey: "pub-c-d8f81eef-9abf-41e7-acb7-a9265281fe33",
    subscribeKey: "sub-c-112a13e6-bace-11ea-bcf8-42a3de10f872",
  })

  useEffect(() => {
      if (pubnub) {
        pubnub.setUUID('_' + Math.random().toString(36).substr(2, 9));

        const listener = {
          message: envelope => {
            setMessages(msgs => [
              {
                plots: plots.concat(envelope.message.content)
              }
            ]);
          }
        };

        pubnub.addListener(listener);
        pubnub.subscribe({ channels: ["draw"] });

        return () => {
          pubnub.removeListener(listener);
          pubnub.unsubscribeAll();
        };
      }
    }, [pubnub, plots]);
  //do DrawFromStream here
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * 2 -400|| 300;
    canvas.height = window.innerHeight * 2  || 300;
    canvas.style.width = `${window.innerWidth - 200}px`;
    canvas.style.height = `${window.innerHeight}px`;

    const context = canvas.getContext("2d")
    context.scale(2,2)
    context.lineCap = "round"
    context.strokeStyle = "black"
    context.lineWidth = 5
    contextRef.current = context;
  }, [])

  const getMousePos = (canvas, evt) => {
      var rect = canvas.getBoundingClientRect();
      return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
      };
  }

  const startDrawing = ({nativeEvent}) => {
    setIsDrawing(true)
    console.log(nativeEvent.offsetX)
    const canvas = canvasRef.current;
    try{
      const { x , y } = getMousePos(canvas, nativeEvent)
    //track plot points over here
    setPlots(plots.concat({x : x <<0 , y: y << 0}))
    drawOnCanvas(plots)
    }catch(e){}
  }

  const finishDrawing = () => {
   setIsDrawing(false)
   //publish here
   const message = {
      content: plots,
      id: Math.random()
          .toString(16)
          .substr(2)
    };
   pubnub.publish({ channel: "draw", message });
   setPlots([])
  }

  const draw = ({nativeEvent}) => {
    if(!isDrawing){
      return
    }
    const canvas = canvasRef.current;
    try{
      const { x , y } = getMousePos(canvas, nativeEvent)



    //track plot points over here
    setPlots(plots.concat({x : x <<0 , y: y << 0}))

    drawOnCanvas(plots)
    }catch(e){}

  }
  const drawOnCanvas = (plots) => {
    if (plots.length !== 0 ){
      contextRef.current.beginPath()
      contextRef.current.moveTo(plots[0].x, plots[0].y)
      for (var i = 0; i < plots.length; i++) {
        contextRef.current.lineTo(plots[i].x, plots[i].y)
      }
      contextRef.current.stroke()
    }
  }

  const drawFromStream = (messages) => {
    if (messages.length === 1){
       drawOnCanvas(messages[0].plots)
    }
  }

  return (
    <canvas
      id="drawCanvas"
      width="300"
      height="300"
      className = "main"
      onMouseDown={startDrawing}
      onMouseUp={finishDrawing}
      onMouseMove={draw}
      ref={canvasRef}
    >
      {drawFromStream(messages)}
    </canvas>
  );
}

export default App;
