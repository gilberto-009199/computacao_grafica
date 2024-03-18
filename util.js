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
                -(y),
                pixelSize,
                pixelSize
            ); 
            
            
            if(color != "white") util.matrix.btnCell($(`[data-cordenada="${x},${y}"]`), x, y, false);

            //console.log(`[title="x:${cell-1},y:${row-1}"]`,document.querySelector(`[title="x:${cell-1},y:${row-1}"]`));
        },
        load(){
            // Obtendo uma referência para o elemento canvas
            
            let canvas = document.querySelector(util.canvas.selector);

            // reset forçado
            $(util.canvas.selector).parent().html(`<canvas id="meuCanvas" width="${canvas.width}" height="${canvas.height}"></canvas>`);

            canvas = document.querySelector(util.canvas.selector);
            document.querySelector(util.canvas.selectorFrm).reset();

            // Obtendo o contexto de renderização 2D
            let ctx = canvas.getContext('2d');

            
            ctx.translate(35, 35);

            ctx.beginPath();

            // Desenhando as linhas dos quadrantes Plano Cateziano  +
            
            ctx.lineWidth = 0.3;

            ctx.moveTo(-35,0);
            ctx.lineTo(35,0);
            ctx.stroke();
        
            ctx.moveTo(0,-35);
            ctx.lineTo(0, 35);
            ctx.stroke();     
            
            ctx.font = "6px Arial";
            ctx.fillText("+ x", 24, -5);
            ctx.fillText("- y", 5, 30);
            
            ctx.fillText("- x",-33, -5);
            ctx.fillText("+ y", 5, -30);

            
            // Definindo a largura e altura do canvas
            let canvasWidth = canvas.width;
            let canvasHeight = canvas.height;
            
            rows = canvasHeight; // Número de linhas desejado
            cols = canvasWidth; // Número de colunas desejado

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
            
            const centroX = Math.floor(matrix[0].length / 2); // Coordenada x do centro da matriz
            const centroY = Math.floor(matrix.length / 2); // Coordenada y do centro da matriz
            
            for (let i = 0; i < matrix.length; i++) {
                let rwline = $("<div class='line'></div>");
                for (let j = 0; j < matrix[i].length; j++) {
                    // Convertendo as coordenadas do DOM para coordenadas do plano cartesiano
                    const x = j - centroX; // Ajuste para o centro eixo x
                    const y = centroY - i; // Ajuste para o centro eixo y
            
                    // Adicionando a célula com as coordenadas no tooltip
                    rwline.append(`
                        <div class="cell" onclick="util.matrix.btnCell(this, ${x}, ${y})"
                             data-value="0" 
                             data-cordenada="${x},${y}"
                             data-matrix="${i},${j}"
                             data-toggle="tooltip"
                             title="x:${x}, y:${y}">
                             0
                        </div>`);
                }
                tblMatrix.append(rwline);
            }

            let lblPixelCount = $(util.matrix.selectorlblPixel);
            lblPixelCount.text(`${matrix.length}x${matrix[0].length}`)
        },

        /* Celula aonde o usuario faz o click */
        btnCell(elm, x, y, render = true){

            let value       = $(elm).attr('data-value') == 1 ? 0 : 1;
            let buff        = util.matrix.buff;
            let [row, cell] = $(elm).attr("data-matrix").split(',')

            buff[row][cell] = value;

            $(elm).attr('data-value',value);
            $(elm).text(value);


            // draw in canvas
            if(render)util.canvas.write_pixel(
                (x),
                (y),
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