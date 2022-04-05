module device_drivers_control(

  ///////// CLOCK /////////
  input              CLOCK_50,

  ///////// HPS /////////
  inout              HPS_CONV_USB_N,
  output      [14:0] HPS_DDR3_ADDR,
  output      [2:0]  HPS_DDR3_BA,
  output             HPS_DDR3_CAS_N,
  output             HPS_DDR3_CKE,
  output             HPS_DDR3_CK_N,
  output             HPS_DDR3_CK_P,
  output             HPS_DDR3_CS_N,
  output      [3:0]  HPS_DDR3_DM,
  inout       [31:0] HPS_DDR3_DQ,
  inout       [3:0]  HPS_DDR3_DQS_N,
  inout       [3:0]  HPS_DDR3_DQS_P,
  output             HPS_DDR3_ODT,
  output             HPS_DDR3_RAS_N,
  output             HPS_DDR3_RESET_N,
  input              HPS_DDR3_RZQ,
  output             HPS_DDR3_WE_N,
  output             HPS_ENET_GTX_CLK,
  inout              HPS_ENET_INT_N,
  output             HPS_ENET_MDC,
  inout              HPS_ENET_MDIO,
  input              HPS_ENET_RX_CLK,
  input       [3:0]  HPS_ENET_RX_DATA,
  input              HPS_ENET_RX_DV,
  output      [3:0]  HPS_ENET_TX_DATA,
  output             HPS_ENET_TX_EN,
  inout              HPS_GSENSOR_INT,
  inout              HPS_I2C1_SCLK,
  inout              HPS_I2C1_SDAT,
  inout              HPS_I2C_CONTROL,
  inout              HPS_KEY,
  inout              HPS_LED,
  inout              HPS_LTC_GPIO,
  output             HPS_SD_CLK,
  inout              HPS_SD_CMD,
  inout       [3:0]  HPS_SD_DATA,
  input              HPS_UART_RX,
  output             HPS_UART_TX,
  input              HPS_USB_CLKOUT,
  inout       [7:0]  HPS_USB_DATA,
  input              HPS_USB_DIR,
  input              HPS_USB_NXT,
  output             HPS_USB_STP,

  ///////// CAMERA  /////////
  inout      [35:0]   CAM_CONNECTOR,
  input 				    camera_capture_en,
  input               reset_stream_key,

  //////// SIGNALS TO GENRATE VGA OUTPUT ///////
  //RGB image from the synchronyzer
  output    [11:0]    export_sync_rgb_red,
  output    [11:0]    export_sync_rgb_blue,
  output	   [11:0]    export_sync_rgb_green,
  output				    export_sync_rgb_dval,
  //clock and resets for the VGA
  output              export_ccd_pixel_clk,
  output              export_clk_25,
  output              export_hps2fpga_reset_n,
  output              export_video_stream_reset_n,

  //////FRAME RATE IN BINARY, TO 7 SEGMENT DISPLAYS////
  output 	[31:0] 	 export_rate,

  /////PULSE_LED////
   output 				 pulse_led
  );

//============================================================================
//  REG/WIRE declarations
//============================================================================

//Resets
  wire    hps2fpga_reset_n;
  wire    camera_soft_reset_n;
  wire    video_stream_reset_n;
  assign video_stream_reset_n = (camera_soft_reset_n & reset_stream_key);

  wire    clk_24;
  wire           ccd_pixel_clk;
  wire    clk_25;
  wire    clk_191;


//============================================================================
//  Structural coding
//============================================================================

//---------------------Qsys System---------------------//
soc_system u0 (
  //Input clocks
  .clk_50_clk                            ( CLOCK_50 ),
  .ccd_pixel_clock_bridge_clk            ( ccd_pixel_clk ),
  //Output clocks
  .pll_vga_clks_25_clk                   ( clk_25 ),
  .pll_vga_clks_191_clk                  ( clk_191 ),
  .pll_camera_clks_24_clk                ( clk_24 ),
  //HPS reset output
  .h2f_reset_reset_n                     ( hps2fpga_reset_n ),
  // Avalon camera camera_config signals
  .avalon_camera_export_width            ( img_width ),
  .avalon_camera_export_height           ( img_height ),
  .avalon_camera_export_startrow         ( start_row ),
  .avalon_camera_export_startcol         ( start_column ),
  .avalon_camera_export_colmode          ( in_column_mode ),
  .avalon_camera_export_exposure         ( in_exposure ),
  .avalon_camera_export_rowsize          ( in_row_size ),
  .avalon_camera_export_colsize          ( in_column_size ),
  .avalon_camera_export_rowmode          ( in_row_mode ),
  .avalon_camera_export_h_blanking       ( h_blanking ),
  .avalon_camera_export_v_blanking       ( v_blanking ),
  .avalon_camera_export_red_gain         ( red_gain ),
  .avalon_camera_export_blue_gain        ( blue_gain ),
  .avalon_camera_export_green1_gain      ( green1_gain ),
  .avalon_camera_export_green2_gain      ( green2_gain ),
  .avalon_camera_export_soft_reset_n     ( camera_soft_reset_n ),
  // Import images in Qsys for the avalon_image_writers
  .rgbgray_img_data_valid                ( sync_ccd_dval ),
  //.rgbgray_img_data_valid                ( 1'b1 ),
  .rgbgray_img_input_data                ( {7'd0, sync_rgb_blue[11:4], sync_rgb_green[11:4], sync_rgb_red[11:4]} ),
  .rgbgray_img_img_width                 ( img_width ),
  .rgbgray_img_img_height                ( img_height ),
  .rgbgray_stream_reset_n_reset_n		  ( hps2fpga_reset_n & video_stream_reset_n ),
  //HPS 1GB ddr3
  .memory_mem_a                          ( HPS_DDR3_ADDR ),
  .memory_mem_ba                         ( HPS_DDR3_BA ),
  .memory_mem_ck                         ( HPS_DDR3_CK_P ),
  .memory_mem_ck_n                       ( HPS_DDR3_CK_N ),
  .memory_mem_cke                        ( HPS_DDR3_CKE ),
  .memory_mem_cs_n                       ( HPS_DDR3_CS_N ),
  .memory_mem_ras_n                      ( HPS_DDR3_RAS_N ),
  .memory_mem_cas_n                      ( HPS_DDR3_CAS_N ),
  .memory_mem_we_n                       ( HPS_DDR3_WE_N ),
  .memory_mem_reset_n                    ( HPS_DDR3_RESET_N) ,
  .memory_mem_dq                         ( HPS_DDR3_DQ ),
  .memory_mem_dqs_n                      ( HPS_DDR3_DQS_N ),
  .memory_mem_dqs                        ( HPS_DDR3_DQS_P ),
  .memory_mem_odt                        ( HPS_DDR3_ODT ),
  .memory_mem_dm                         ( HPS_DDR3_DM ),
  .memory_oct_rzqin                      ( HPS_DDR3_RZQ ),
  //HPS ethernet
  .hps_0_hps_io_hps_io_emac1_inst_TX_CLK ( HPS_ENET_GTX_CLK ),
  .hps_0_hps_io_hps_io_emac1_inst_TXD0   ( HPS_ENET_TX_DATA[0] ),
  .hps_0_hps_io_hps_io_emac1_inst_TXD1   ( HPS_ENET_TX_DATA[1] ),
  .hps_0_hps_io_hps_io_emac1_inst_TXD2   ( HPS_ENET_TX_DATA[2] ),
  .hps_0_hps_io_hps_io_emac1_inst_TXD3   ( HPS_ENET_TX_DATA[3] ),
  .hps_0_hps_io_hps_io_emac1_inst_RXD0   ( HPS_ENET_RX_DATA[0] ),
  .hps_0_hps_io_hps_io_emac1_inst_MDIO   ( HPS_ENET_MDIO ),
  .hps_0_hps_io_hps_io_emac1_inst_MDC    ( HPS_ENET_MDC ),
  .hps_0_hps_io_hps_io_emac1_inst_RX_CTL ( HPS_ENET_RX_DV ),
  .hps_0_hps_io_hps_io_emac1_inst_TX_CTL ( HPS_ENET_TX_EN ),
  .hps_0_hps_io_hps_io_emac1_inst_RX_CLK ( HPS_ENET_RX_CLK ),
  .hps_0_hps_io_hps_io_emac1_inst_RXD1   ( HPS_ENET_RX_DATA[1] ),
  .hps_0_hps_io_hps_io_emac1_inst_RXD2   ( HPS_ENET_RX_DATA[2] ),
  .hps_0_hps_io_hps_io_emac1_inst_RXD3   ( HPS_ENET_RX_DATA[3] ),
  //HPS SD card
  .hps_0_hps_io_hps_io_sdio_inst_CMD     ( HPS_SD_CMD ),
  .hps_0_hps_io_hps_io_sdio_inst_D0      ( HPS_SD_DATA[0] ),
  .hps_0_hps_io_hps_io_sdio_inst_D1      ( HPS_SD_DATA[1] ),
  .hps_0_hps_io_hps_io_sdio_inst_CLK     ( HPS_SD_CLK ),
  .hps_0_hps_io_hps_io_sdio_inst_D2      ( HPS_SD_DATA[2] ),
  .hps_0_hps_io_hps_io_sdio_inst_D3      ( HPS_SD_DATA[3] ),
  //HPS USB
  .hps_0_hps_io_hps_io_usb1_inst_D0      ( HPS_USB_DATA[0] ),
  .hps_0_hps_io_hps_io_usb1_inst_D1      ( HPS_USB_DATA[1] ),
  .hps_0_hps_io_hps_io_usb1_inst_D2      ( HPS_USB_DATA[2] ),
  .hps_0_hps_io_hps_io_usb1_inst_D3      ( HPS_USB_DATA[3] ),
  .hps_0_hps_io_hps_io_usb1_inst_D4      ( HPS_USB_DATA[4] ),
  .hps_0_hps_io_hps_io_usb1_inst_D5      ( HPS_USB_DATA[5] ),
  .hps_0_hps_io_hps_io_usb1_inst_D6      ( HPS_USB_DATA[6] ),
  .hps_0_hps_io_hps_io_usb1_inst_D7      ( HPS_USB_DATA[7] ),
  .hps_0_hps_io_hps_io_usb1_inst_CLK     ( HPS_USB_CLKOUT ),
  .hps_0_hps_io_hps_io_usb1_inst_STP     ( HPS_USB_STP ),
  .hps_0_hps_io_hps_io_usb1_inst_DIR     ( HPS_USB_DIR ),
  .hps_0_hps_io_hps_io_usb1_inst_NXT     ( HPS_USB_NXT ),
  //HPS UART
  .hps_0_hps_io_hps_io_uart0_inst_RX     ( HPS_UART_RX ),
  .hps_0_hps_io_hps_io_uart0_inst_TX     ( HPS_UART_TX ),
  //HPS I2C1
  .hps_0_hps_io_hps_io_i2c0_inst_SDA     ( HPS_I2C1_SDAT ),
  .hps_0_hps_io_hps_io_i2c0_inst_SCL     ( HPS_I2C1_SCLK ),
  //HPS GPIO
  .hps_0_hps_io_hps_io_gpio_inst_GPIO09  ( HPS_CONV_USB_N ),
  .hps_0_hps_io_hps_io_gpio_inst_GPIO35  ( HPS_ENET_INT_N ),
  .hps_0_hps_io_hps_io_gpio_inst_GPIO40  ( HPS_LTC_GPIO ),
  .hps_0_hps_io_hps_io_gpio_inst_GPIO53  ( HPS_LED ),
  .hps_0_hps_io_hps_io_gpio_inst_GPIO54  ( HPS_KEY ),
  .hps_0_hps_io_hps_io_gpio_inst_GPIO61  ( HPS_GSENSOR_INT )
  );

//-----------------Camera Configuration and Capture-----------------//
// Component for writing configuration to the camera peripheral
// after reset/start-up.
camera_config #(
  .CLK_FREQ(25000000),  // 25 MHz
  .I2C_FREQ(20000)      // 20 kHz
  ) camera_conf(
  // Host Side
  .clock(ccd_pixel_clk),
  .reset_n(hps2fpga_reset_n & video_stream_reset_n),
  // Configuration registers
  .exposure(in_exposure),
  .start_row(in_start_row),
  .start_column(in_start_column),
  .row_size(in_row_size),
  .column_size(in_column_size),
  .row_mode(in_row_mode),
  .column_mode(in_column_mode),
  .h_blanking(h_blanking),
  .v_blanking(v_blanking),
  .red_gain(red_gain),
  .blue_gain(blue_gain),
  .green1_gain(green1_gain),
  .green2_gain(green2_gain),
  // Ready signal
  .out_ready(ready),
  // I2C Side
  .I2C_SCLK(CAM_CONNECTOR[24]),
  .I2C_SDAT(CAM_CONNECTOR[23])
  );
  // Camera config (I2C)
  wire          ready;
  wire  [15:0]  in_exposure;
  wire  [15:0]  start_row;
  wire  [15:0]  start_column;
  wire  [15:0]  in_row_size;
  wire  [15:0]  in_column_size;
  wire  [15:0]  in_row_mode;
  wire  [15:0]  in_column_mode;
  wire  [15:0]  h_blanking;
  wire  [15:0]  v_blanking;
  wire  [15:0]  red_gain;
  wire  [15:0]  blue_gain;
  wire  [15:0]  green1_gain;
  wire  [15:0]  green2_gain;

//Gets image from camera connector and provides raw 12-bit pixels
//Also implements a pixel, line and frame counter
camera_capture u3(
  .out_data     (ccd_data_captured),    // component output data
  .out_valid    (ccd_dval),             // data valid signal
  .out_count_x  (X_Cont_raw),
  .out_count_y  (Y_Cont_raw),
  .oFrame_Cont  (Frame_Cont),           // Frames counter
  .in_data      (ccd_data_raw),         // 12-bit data
  .in_frame_valid (ccd_fval_raw),       // Frame valid signal
  .in_line_valid  (ccd_lval_raw),       // Line valid signal
  .in_start     (camera_capture_en),    // Enable camera capture
  .clock        (ccd_pixel_clk),
  // Negative logic reset
  .reset_n      (hps2fpga_reset_n & video_stream_reset_n),
  .in_width     (img_width[11:0]),
  .in_height    (img_height[11:0])
  );
  reg     [11:0] ccd_data_raw;        //input raw data to CCD_Capture
  reg            ccd_fval_raw;        //frame valid
  reg            ccd_lval_raw;        //line valid
  wire    [15:0] img_width;
  wire    [15:0] img_height;
  wire    [11:0] X_Cont_raw;
  wire    [11:0] Y_Cont_raw;
  wire    [11:0] ccd_data_captured;   //output data from CCD_Capture
  wire        	  ccd_dval;            //valid output data
  wire    [31:0] Frame_Cont;

  //CCD peripheral signal
  wire    [11:0] CCD_DATA;

  // CCD_Capture external pinout conections.
  assign  CCD_DATA[0]  =  CAM_CONNECTOR[13]; //Pixel data Bit 0
  assign  CCD_DATA[1]  =  CAM_CONNECTOR[12]; //Pixel data Bit 1
  assign  CCD_DATA[2]  =  CAM_CONNECTOR[11]; //Pixel data Bit 2
  assign  CCD_DATA[3]  =  CAM_CONNECTOR[10]; //Pixel data Bit 3
  assign  CCD_DATA[4]  =  CAM_CONNECTOR[9];  //Pixel data Bit 4
  assign  CCD_DATA[5]  =  CAM_CONNECTOR[8];  //Pixel data Bit 5
  assign  CCD_DATA[6]  =  CAM_CONNECTOR[7];  //Pixel data Bit 6
  assign  CCD_DATA[7]  =  CAM_CONNECTOR[6];  //Pixel data Bit 7
  assign  CCD_DATA[8]  =  CAM_CONNECTOR[5];  //Pixel data Bit 8
  assign  CCD_DATA[9]  =  CAM_CONNECTOR[4];  //Pixel data Bit 9
  assign  CCD_DATA[10] =  CAM_CONNECTOR[3];  //Pixel data Bit 10
  assign  CCD_DATA[11] =  CAM_CONNECTOR[1];  //Pixel data Bit 11
  assign  CAM_CONNECTOR[16]   =  clk_24;    //External input clock
  assign  CCD_FVAL     =  CAM_CONNECTOR[22]; //frame valid
  assign  CCD_LVAL     =  CAM_CONNECTOR[21]; //line valid
  assign  ccd_pixel_clk=  CAM_CONNECTOR[0];  //Pixel clock
  assign  CAM_CONNECTOR[19]   =  1'b1;       //trigger
  assign  CAM_CONNECTOR[17]   =  hps2fpga_reset_n & video_stream_reset_n;

  // Refreshes the data on the CCD camera on every pixel clock pulse.
  always@(posedge ccd_pixel_clk)
    begin
    ccd_data_raw  <=  CCD_DATA;
    ccd_lval_raw  <=  CCD_LVAL;
    ccd_fval_raw  <=  CCD_FVAL;
  end


//---------------Raw 2 RGB and Frame syncronization --------------//
frame_sync frame_sync1(
  .clk					(ccd_pixel_clk),
  .reset_n				(hps2fpga_reset_n & video_stream_reset_n),
  //Input image and sync signals
  .in_pix				(ccd_data_captured),
  .in_data_valid 		(ccd_dval),
  .in_frame_valid		(ccd_fval_raw),
  //Output image and sync signals
  .out_pix				(sync_ccd_data_captured),
  .out_data_valid 	(sync_ccd_dval),
  .out_frame_valid	(sync_ccd_fval)
   );
  wire    [11:0] sync_ccd_data_captured;
  wire           sync_ccd_dval;
  wire           sync_ccd_fval;

raw2rgb  #(
  .PIX_SIZE(12)
  ) u4(
  .clk         (ccd_pixel_clk),
  // Negative logic reset
  .reset_n      (hps2fpga_reset_n & video_stream_reset_n),
  .pix          (sync_ccd_data_captured),  // Component input data
  .data_valid   (sync_ccd_dval),           // Data valid signal
  .oRed         (sync_rgb_red),        // Output red component
  .oGreen       (sync_rgb_green),      // Output green component
  .oBlue        (sync_rgb_blue),       // Output blue component
  .oDVAL        (sync_rgb_dval),       // Pixel value available
  .img_width    (img_width),
  .img_height   (img_height)
  );
  wire    [15:0] X_Cont;
  wire    [15:0] Y_Cont;
  assign X_Cont = {4'd0, X_Cont_raw};
  assign Y_Cont = {4'd0, Y_Cont_raw};
  //RAW2RGB signals
  wire    [11:0] sync_rgb_red;
  wire    [11:0] sync_rgb_green;
  wire    [11:0] sync_rgb_blue;
  wire           sync_rgb_dval; //data valid
  wire  [7:0] binarized_8bit;
  wire  [7:0] eroded_8bit;
  wire  [7:0] dilated_8bit;

  // Generate a 8 bit bin img with all 8 bits 0 or 1
  assign binarized_8bit = 8'd180;//binarized ? 8'd255 : 8'd0;
  assign eroded_8bit = 8'd180;//eroded ? 8'd255 : 8'd0;
  assign dilated_8bit = 8'd180;//dilated ? 8'd255 : 8'd0;

  //---------------Calculate the frame rate--------------//
  // Seconds counter. The output will be 1 during one pulse after 1 second.
  reg   [31:0] count;
  reg   [31:0] rate;
  reg   [11:0] rate_bcd;
  reg   [31:0] _Frame_Cont;
  reg          pulse;
  always @(posedge CLOCK_50) begin
    if (count < 50000000) begin
      count = count + 1;
      // seconds_pulse = 0;
    end
    else begin
      count = 0;
      // seconds_pulse = 1;
      pulse = ~pulse;
      rate = Frame_Cont - _Frame_Cont;
      _Frame_Cont = Frame_Cont;
    end
  end
  assign pulse_led = pulse;
  //--------Convert rate to bcd to show in 7-segmends-------//
  binary_to_bcd #(
    .bits(10),  
    .digits(3)  
  ) bit_to_bcd1 (
    .clk(ccd_pixel_clk),
    .reset_n(hps2fpga_reset_n & video_stream_reset_n),
    .ena(1'b1),
    .binary(rate[9:0]),
    .bcd(rate_bcd)
  );
  
//---------Export signals to show images through VGA--------//
  assign export_sync_rgb_red = sync_rgb_red;
  assign export_sync_rgb_green = sync_rgb_green;
  assign export_sync_rgb_blue = sync_rgb_blue;
  assign export_sync_rgb_dval = sync_rgb_dval;
  assign export_binarized_8bit = binarized_8bit;
  assign export_eroded_8bit = eroded_8bit;
  assign export_dilated_8bit = dilated_8bit;
  assign export_ccd_pixel_clk = ccd_pixel_clk;
  assign export_clk_25 = clk_25;
  assign export_hps2fpga_reset_n = hps2fpga_reset_n;
  assign export_video_stream_reset_n= video_stream_reset_n;
  assign export_rate = {22'b0, rate_bcd};

endmodule
