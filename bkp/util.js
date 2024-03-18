// utilitario 
var util = {
    canvas:{
        selector:'#meuCanvas',
        selectorFrm:'#frm',
        pixelSize: 1,
        marginX: 0,
        marginY: 0,
        /* Converte Coordenada Carteziana para Pixel do canvas */
        coordenadasParaCanvas(xPlanoCarteziano, yPlanoCarteziano, escala = 1) {
            
            let canvas = document.querySelector(util.canvas.selector);

            let larguraDoCanvas = canvas.width;
            let alturaDoCanvas = canvas.height;

            rows = alturaDoCanvas; // Número de linhas desejado
            cols = larguraDoCanvas;

            return { 
                x: (rows / 2 + xPlanoCarteziano * escala),
                y: (cols / 2 - ( - yPlanoCarteziano) * escala) 
            };
        },
        write_pixel(row, cell, color = 'blue', pixelSize = util.canvas.pixelSize){

            var canvas = document.querySelector(util.canvas.selector);

            let ctx = canvas.getContext('2d');
            let x = row * pixelSize, y = cell * pixelSize;
            
            ctx.fillStyle = color;
            
            ctx.fillRect(
                x,
                y,
                pixelSize,
                pixelSize
            );
            if(color != "white") util.matrix.btnCell($(`[title="x:${cell},y:${row}"]`), cell, row, false);

            //console.log(`[title="x:${cell-1},y:${row-1}"]`,document.querySelector(`[title="x:${cell-1},y:${row-1}"]`));
        },
        load(){
            // Obtendo uma referência para o elemento canvas
            let canvas = document.querySelector(util.canvas.selector);

            // Obtendo o contexto de renderização 2D
            let ctx = canvas.getContext('2d');

            

            document.querySelector(util.canvas.selectorFrm).reset();
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Definindo a largura e altura do canvas
            let canvasWidth = canvas.width;
            let canvasHeight = canvas.height;
            
            // Definindo as margens para os eixos
            let marginX = util.canvas.marginX;
            let marginY = util.canvas.marginY;
            
            // Desenhando as linhas dos quadrantes Plano Cateziano  +
            ctx.strokeStyle = 'gray'; // Cor das linhas dos quadrantes
            ctx.lineWidth = 0.4;
            ctx.beginPath();

            ctx.moveTo(marginX, canvasHeight / 2);
            ctx.lineTo(canvasWidth - marginX, canvasHeight / 2);
            ctx.stroke();
            ctx.lineWidth = 0.4;
            ctx.beginPath();

            ctx.moveTo(canvasWidth / 2, marginY);
            ctx.lineTo(canvasWidth / 2, canvasHeight - marginY);
            ctx.stroke();

            // Calculando o total de pixels
            let larguraDoCanvas = canvas.width;
            let alturaDoCanvas = canvas.height;
            //var totalDePixels = larguraDoCanvas * alturaDoCanvas;

            ctx.fillStyle = "gray";
            ctx.font = "8px roboto";
            ctx.fillText(`${larguraDoCanvas}x${alturaDoCanvas}`, canvasWidth - 40, canvasHeight - 10, 70);
            
            rows = alturaDoCanvas; // Número de linhas desejado
            cols = larguraDoCanvas; // Número de colunas desejado

            // Mount Matrix Pixels

            let matrix = [];
            

            for (let i = 0; i < rows; i++) {
                let line = [];
                for (let j = 0; j < cols; j++) {
                    //adding cell
                    line.push(0);
                }
                matrix.push(line);
            }

            util.matrix.load(matrix)
        }
    },
    matrix:{
        selector: '.matrix',
        selectorlblPixel: '#pixelMatrix',
        buff: [],

        load(matrix = util.matrix.buff){
            
            util.matrix.buff = matrix;
            
            // Mount DOM
            let tblMatrix = $('div.matrix');
            tblMatrix.html('');

            for (let i = 0; i < matrix.length; i++) {
                let rwline = $("<div class='line'></div>");
                for (let j = 0; j < matrix[i].length; j++) {
                    //adding cell
                    
                    rwline.append(`
                        <div class="cell" onclick="util.matrix.btnCell(this,${i},${j})"
                             data-value="0" data-toggle="tooltip" title="x:${i},y:${j}">
                             0
                        </div>`);
                }
                tblMatrix.append(rwline);
            }

            let lblPixelCount = $(util.matrix.selectorlblPixel);
            lblPixelCount.text(`${matrix.length}x${matrix[0].length}`)
        },

        /* Celula aonde o usuario faz o click */
        btnCell(elm, row, cell, render = true){

            let value       = $(elm).attr('data-value') == 1 ? 0 : 1;
            let buff        = util.matrix.buff;

            buff[row][cell] = value;

            $(elm).attr('data-value',value);
            $(elm).text(value);


            // draw in canvas
            if(render)util.canvas.write_pixel(
                cell,
                row,
                (value ? 'blue' : 'white')
            )
            
            // replace toggle data-value
            if(!render){
                buff[row][cell] = 1;

                $(elm).attr('data-value',1);
                $(elm).text(1);
            }
        }
        
    }
}