`define reset 4'b0000
`define start 4'b0001
`define read1 4'b0010
`define read2 4'b0100
`define add 4'b0110
`define valid 4'b0111

module accel(
    input logic clk,
    input logic rst_n,

    output logic [31:0] M_address,
    output logic [31:0] M_writedata,
    output logic M_write,
    input logic [31:0] M_readdata,
    output logic M_read,
    input logic M_waitrequest,

    input logic [2:0] S_address,
    input logic [31:0] S_writedata,
    input logic S_write,
    output logic [31:0] S_readdata,
    input logic S_read,
    output logic S_waitrequest
);

    logic [20:0] count;
    logic [31:0] sum;
    logic [31:0] var1, var2;
    logic [31:0] addr0, addr1;
    logic [31:0] inaddr0, inaddr1;

    logic loada0, loada1, loadc, loads, loadv1, loadv2;
    logic sela;
    logic start;
    logic [20:0] n;
    logic initc, inits, inita0, inita1;

    assign M_write = 1'b0;
    assign M_writedata = 32'd0;

    always_ff@(posedge clk, negedge rst_n) begin

        if(!rst_n) begin
            n = 21'd0;
            start = 1'b0;
        end
        else begin
            if(S_read) begin
                case(S_address)
                    32'd0: S_readdata <= start;
                    32'd1: S_readdata <= inaddr0;
                    32'd2: S_readdata <= inaddr1;
                    32'd3: S_readdata <= n + 32'd1;
                    32'd4: S_readdata <= sum;
                endcase
            end
            if(S_write) begin
                case(S_address)
                    32'd0: start <= S_writedata;
                    32'd1: inaddr0 <= S_writedata;
                    32'd2: inaddr1 <= S_writedata;
                    32'd3: n <= S_writedata;
                    //32'd4: sum <= S_writedata; // TODO: Remove alter
                endcase
            end
        end

    end

    always_ff@(posedge clk, negedge rst_n) begin

        if(!rst_n) begin
            sum <= 32'd0;
            count <= 21'd0;
        end
        else begin
            if(loada0) addr0 <= inita0 == 1'b1 ? inaddr0 + 32'd0: addr0 + 32'd4;
            if(loada1) addr1 <= inita1 == 1'b1 ? inaddr1 + 32'd0: addr1 + 32'd4;
            if(loadc) count <= initc == 1'b1 ? 21'd0 : count + 21'd1;
            if(loads) sum <= inits == 1'b1 ? 32'd0 : sum +  var1 * var2;
            if(loadv1) var1 <= M_readdata;
            if(loadv2) var2 <= M_readdata;
        end

    end

    // address select
    assign M_address = sela == 1'b0 ? addr0 : addr1;

    // state machine
    logic [3:0] state;

    always_ff @(posedge clk, negedge rst_n) begin
        if(!rst_n) begin
            state <= `reset;
        end
        else begin
            case(state)
                `reset: state <= `start;
                `start: state <= (S_read == 1'b1 && S_address == 3'd4) ? `read1 : 
                                    (S_read == 1'b1 || S_write) ? `valid : 
                                    `start;
                `read1: state <= M_waitrequest == 1'b0 ? `read2 : `read1 ;
                `read2: state <= M_waitrequest == 1'b0 ? `add : `read2 ;
                `add: state <= count < n ? `read1 : `valid;
                `valid: state <= `start;
                default: state <= `reset;
            endcase
        end
    end

    always_comb begin
        case(state) 
            `reset: {loada0, loada1, initc, loadc, inits, loads, loadv1, loadv2, sela, S_waitrequest, M_read, inita0, inita1} = 13'b00_00_00_00_0_0_0_00;
            `start: {loada0, loada1, initc, loadc, inits, loads, loadv1, loadv2, sela, S_waitrequest, M_read, inita0, inita1} = 13'b11_11_11_00_0_1_0_11;
            `read1: {loada0, loada1, initc, loadc, inits, loads, loadv1, loadv2, sela, S_waitrequest, M_read, inita0, inita1} = 13'b00_00_00_10_0_1_1_00;
            `read2: {loada0, loada1, initc, loadc, inits, loads, loadv1, loadv2, sela, S_waitrequest, M_read, inita0, inita1} = 13'b00_00_00_01_1_1_1_00;
            `add: {loada0, loada1, initc, loadc, inits, loads, loadv1, loadv2, sela, S_waitrequest, M_read, inita0, inita1} = 13'b11_01_01_00_0_1_0_00;
            `valid: {loada0, loada1, initc, loadc, inits, loads, loadv1, loadv2, sela, S_waitrequest, M_read, inita0, inita1} = 13'b00_00_00_00_0_0_0_00;
            default: {loada0, loada1, initc, loadc, inits, loads, loadv1, loadv2, sela, S_waitrequest, M_read, inita0, inita1} = 13'b00_00_00_00_0_0_0_00;
        endcase
    end
endmodule: accel