`timescale 1ps/1ps
module tb_rtl_ksa();

logic clk;
logic rst_n;

logic [31:0] M_address;
logic [31:0] M_writedata;
logic M_write;
logic [31:0] M_readdata;
logic M_read;
logic M_waitrequest;

logic [2:0] S_address;
logic [31:0] S_writedata;
logic S_write;
logic [31:0] S_readdata;
logic S_read;
logic S_waitrequest;

accel dut(.*);
	
	
initial begin
	clk = 1'b0; #1;
	forever begin
		clk = ~clk; #1;
	end
end

initial begin
	
	
	rst_n = 1'b1; #2;
	rst_n = 1'b0; #2;
	rst_n = 1'b1;
	
	assert(M_read === 1'b0) else $error("Error on line %0d", `__LINE__);
    M_waitrequest = 1'b1;
    M_readdata = 32'd2;
    S_read = 1'b0;


    // addr0
    S_write = 1'b1;
    S_address = 3'd1;
    S_writedata = 32'd100;
    #6; // wait one clock cycle

    // addr1
    S_write = 1'b1;
    S_address = 3'd2;
    S_writedata = 32'd200;
    #6; // wait one clock cycle

    // n
    S_write = 1'b1;
    S_address = 3'd3;
    S_writedata = 3'd3;
    #6; // wait one clock cycle

    S_read = 1'b1; // set start
    S_address = 3'd4;
    #6; // wait one clock cycle


    #10;
    M_waitrequest = 1'b0;
    #2;
    M_waitrequest = 1'b1;
    #10;
    M_waitrequest = 1'b0;
	
#100;
$stop;
end

endmodule: tb_rtl_ksa