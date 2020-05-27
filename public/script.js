document.addEventListener("DOMContentLoaded", () => {
  const socket = io.connect();

  const board = document.querySelector("#board");

  const context = board.getContext("2d");

  const brush = {
    isDrawing: false,
    isMoving: false,
    pos: { x: 0, y: 0 },
    previousPos: null,
  };

  board.width = 700;
  board.height = 500;

  context.lineWidth = 7;
  context.strokeStyle = "red";

  const draw = (line) => {
    context.beginPath();
    context.moveTo(line.previousPos.x, line.previousPos.y);
    context.lineTo(line.pos.x, line.pos.y);
    context.stroke();
  };

  board.onmousedown = (event) => {
    brush.isDrawing = true;
  };

  board.onmouseup = (event) => {
    brush.isDrawing = false;
  };

  board.onmousemove = (event) => {
    brush.pos.x = event.clientX;
    brush.pos.y = event.clientY;
    brush.isMoving = true;
  };

  socket.on("draw", (line) => {
    draw(line);
  });

  const main = () => {
    if (brush.isDrawing && brush.isMoving && brush.previousPos) {
      socket.emit("draw", { pos: brush.pos, previousPos: brush.previousPos });
      // draw({ pos: brush.pos, previousPos: brush.previousPos });
      brush.isMoving = false;
    }

    brush.previousPos = { ...brush.pos };

    setTimeout(main, 10);
  };

  main();
});
