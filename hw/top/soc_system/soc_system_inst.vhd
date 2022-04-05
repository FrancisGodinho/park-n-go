	component soc_system is
		port (
			avalon_camera_export_height           : out   std_logic_vector(15 downto 0);                    -- height
			avalon_camera_export_startrow         : out   std_logic_vector(15 downto 0);                    -- startrow
			avalon_camera_export_startcol         : out   std_logic_vector(15 downto 0);                    -- startcol
			avalon_camera_export_colmode          : out   std_logic_vector(15 downto 0);                    -- colmode
			avalon_camera_export_exposure         : out   std_logic_vector(15 downto 0);                    -- exposure
			avalon_camera_export_rowsize          : out   std_logic_vector(15 downto 0);                    -- rowsize
			avalon_camera_export_colsize          : out   std_logic_vector(15 downto 0);                    -- colsize
			avalon_camera_export_rowmode          : out   std_logic_vector(15 downto 0);                    -- rowmode
			avalon_camera_export_soft_reset_n     : out   std_logic;                                        -- soft_reset_n
			avalon_camera_export_width            : out   std_logic_vector(15 downto 0);                    -- width
			avalon_camera_export_h_blanking       : out   std_logic_vector(15 downto 0);                    -- h_blanking
			avalon_camera_export_v_blanking       : out   std_logic_vector(15 downto 0);                    -- v_blanking
			avalon_camera_export_red_gain         : out   std_logic_vector(15 downto 0);                    -- red_gain
			avalon_camera_export_blue_gain        : out   std_logic_vector(15 downto 0);                    -- blue_gain
			avalon_camera_export_green1_gain      : out   std_logic_vector(15 downto 0);                    -- green1_gain
			avalon_camera_export_green2_gain      : out   std_logic_vector(15 downto 0);                    -- green2_gain
			ccd_pixel_clock_bridge_clk            : in    std_logic                     := 'X';             -- clk
			clk_50_clk                            : in    std_logic                     := 'X';             -- clk
			h2f_reset_reset_n                     : out   std_logic;                                        -- reset_n
			hps_0_hps_io_hps_io_emac1_inst_TX_CLK : out   std_logic;                                        -- hps_io_emac1_inst_TX_CLK
			hps_0_hps_io_hps_io_emac1_inst_TXD0   : out   std_logic;                                        -- hps_io_emac1_inst_TXD0
			hps_0_hps_io_hps_io_emac1_inst_TXD1   : out   std_logic;                                        -- hps_io_emac1_inst_TXD1
			hps_0_hps_io_hps_io_emac1_inst_TXD2   : out   std_logic;                                        -- hps_io_emac1_inst_TXD2
			hps_0_hps_io_hps_io_emac1_inst_TXD3   : out   std_logic;                                        -- hps_io_emac1_inst_TXD3
			hps_0_hps_io_hps_io_emac1_inst_RXD0   : in    std_logic                     := 'X';             -- hps_io_emac1_inst_RXD0
			hps_0_hps_io_hps_io_emac1_inst_MDIO   : inout std_logic                     := 'X';             -- hps_io_emac1_inst_MDIO
			hps_0_hps_io_hps_io_emac1_inst_MDC    : out   std_logic;                                        -- hps_io_emac1_inst_MDC
			hps_0_hps_io_hps_io_emac1_inst_RX_CTL : in    std_logic                     := 'X';             -- hps_io_emac1_inst_RX_CTL
			hps_0_hps_io_hps_io_emac1_inst_TX_CTL : out   std_logic;                                        -- hps_io_emac1_inst_TX_CTL
			hps_0_hps_io_hps_io_emac1_inst_RX_CLK : in    std_logic                     := 'X';             -- hps_io_emac1_inst_RX_CLK
			hps_0_hps_io_hps_io_emac1_inst_RXD1   : in    std_logic                     := 'X';             -- hps_io_emac1_inst_RXD1
			hps_0_hps_io_hps_io_emac1_inst_RXD2   : in    std_logic                     := 'X';             -- hps_io_emac1_inst_RXD2
			hps_0_hps_io_hps_io_emac1_inst_RXD3   : in    std_logic                     := 'X';             -- hps_io_emac1_inst_RXD3
			hps_0_hps_io_hps_io_sdio_inst_CMD     : inout std_logic                     := 'X';             -- hps_io_sdio_inst_CMD
			hps_0_hps_io_hps_io_sdio_inst_D0      : inout std_logic                     := 'X';             -- hps_io_sdio_inst_D0
			hps_0_hps_io_hps_io_sdio_inst_D1      : inout std_logic                     := 'X';             -- hps_io_sdio_inst_D1
			hps_0_hps_io_hps_io_sdio_inst_CLK     : out   std_logic;                                        -- hps_io_sdio_inst_CLK
			hps_0_hps_io_hps_io_sdio_inst_D2      : inout std_logic                     := 'X';             -- hps_io_sdio_inst_D2
			hps_0_hps_io_hps_io_sdio_inst_D3      : inout std_logic                     := 'X';             -- hps_io_sdio_inst_D3
			hps_0_hps_io_hps_io_usb1_inst_D0      : inout std_logic                     := 'X';             -- hps_io_usb1_inst_D0
			hps_0_hps_io_hps_io_usb1_inst_D1      : inout std_logic                     := 'X';             -- hps_io_usb1_inst_D1
			hps_0_hps_io_hps_io_usb1_inst_D2      : inout std_logic                     := 'X';             -- hps_io_usb1_inst_D2
			hps_0_hps_io_hps_io_usb1_inst_D3      : inout std_logic                     := 'X';             -- hps_io_usb1_inst_D3
			hps_0_hps_io_hps_io_usb1_inst_D4      : inout std_logic                     := 'X';             -- hps_io_usb1_inst_D4
			hps_0_hps_io_hps_io_usb1_inst_D5      : inout std_logic                     := 'X';             -- hps_io_usb1_inst_D5
			hps_0_hps_io_hps_io_usb1_inst_D6      : inout std_logic                     := 'X';             -- hps_io_usb1_inst_D6
			hps_0_hps_io_hps_io_usb1_inst_D7      : inout std_logic                     := 'X';             -- hps_io_usb1_inst_D7
			hps_0_hps_io_hps_io_usb1_inst_CLK     : in    std_logic                     := 'X';             -- hps_io_usb1_inst_CLK
			hps_0_hps_io_hps_io_usb1_inst_STP     : out   std_logic;                                        -- hps_io_usb1_inst_STP
			hps_0_hps_io_hps_io_usb1_inst_DIR     : in    std_logic                     := 'X';             -- hps_io_usb1_inst_DIR
			hps_0_hps_io_hps_io_usb1_inst_NXT     : in    std_logic                     := 'X';             -- hps_io_usb1_inst_NXT
			hps_0_hps_io_hps_io_uart0_inst_RX     : in    std_logic                     := 'X';             -- hps_io_uart0_inst_RX
			hps_0_hps_io_hps_io_uart0_inst_TX     : out   std_logic;                                        -- hps_io_uart0_inst_TX
			hps_0_hps_io_hps_io_i2c0_inst_SDA     : inout std_logic                     := 'X';             -- hps_io_i2c0_inst_SDA
			hps_0_hps_io_hps_io_i2c0_inst_SCL     : inout std_logic                     := 'X';             -- hps_io_i2c0_inst_SCL
			hps_0_hps_io_hps_io_gpio_inst_GPIO09  : inout std_logic                     := 'X';             -- hps_io_gpio_inst_GPIO09
			hps_0_hps_io_hps_io_gpio_inst_GPIO35  : inout std_logic                     := 'X';             -- hps_io_gpio_inst_GPIO35
			hps_0_hps_io_hps_io_gpio_inst_GPIO40  : inout std_logic                     := 'X';             -- hps_io_gpio_inst_GPIO40
			hps_0_hps_io_hps_io_gpio_inst_GPIO53  : inout std_logic                     := 'X';             -- hps_io_gpio_inst_GPIO53
			hps_0_hps_io_hps_io_gpio_inst_GPIO54  : inout std_logic                     := 'X';             -- hps_io_gpio_inst_GPIO54
			hps_0_hps_io_hps_io_gpio_inst_GPIO61  : inout std_logic                     := 'X';             -- hps_io_gpio_inst_GPIO61
			memory_mem_a                          : out   std_logic_vector(14 downto 0);                    -- mem_a
			memory_mem_ba                         : out   std_logic_vector(2 downto 0);                     -- mem_ba
			memory_mem_ck                         : out   std_logic;                                        -- mem_ck
			memory_mem_ck_n                       : out   std_logic;                                        -- mem_ck_n
			memory_mem_cke                        : out   std_logic;                                        -- mem_cke
			memory_mem_cs_n                       : out   std_logic;                                        -- mem_cs_n
			memory_mem_ras_n                      : out   std_logic;                                        -- mem_ras_n
			memory_mem_cas_n                      : out   std_logic;                                        -- mem_cas_n
			memory_mem_we_n                       : out   std_logic;                                        -- mem_we_n
			memory_mem_reset_n                    : out   std_logic;                                        -- mem_reset_n
			memory_mem_dq                         : inout std_logic_vector(31 downto 0) := (others => 'X'); -- mem_dq
			memory_mem_dqs                        : inout std_logic_vector(3 downto 0)  := (others => 'X'); -- mem_dqs
			memory_mem_dqs_n                      : inout std_logic_vector(3 downto 0)  := (others => 'X'); -- mem_dqs_n
			memory_mem_odt                        : out   std_logic;                                        -- mem_odt
			memory_mem_dm                         : out   std_logic_vector(3 downto 0);                     -- mem_dm
			memory_oct_rzqin                      : in    std_logic                     := 'X';             -- oct_rzqin
			pll_camera_clks_24_clk                : out   std_logic;                                        -- clk
			pll_vga_clks_191_clk                  : out   std_logic;                                        -- clk
			pll_vga_clks_25_clk                   : out   std_logic;                                        -- clk
			rgbgray_img_data_valid                : in    std_logic                     := 'X';             -- data_valid
			rgbgray_img_input_data                : in    std_logic_vector(31 downto 0) := (others => 'X'); -- input_data
			rgbgray_img_img_width                 : in    std_logic_vector(15 downto 0) := (others => 'X'); -- img_width
			rgbgray_img_img_height                : in    std_logic_vector(15 downto 0) := (others => 'X'); -- img_height
			rgbgray_stream_reset_n_reset_n        : in    std_logic                     := 'X'              -- reset_n
		);
	end component soc_system;

	u0 : component soc_system
		port map (
			avalon_camera_export_height           => CONNECTED_TO_avalon_camera_export_height,           --   avalon_camera_export.height
			avalon_camera_export_startrow         => CONNECTED_TO_avalon_camera_export_startrow,         --                       .startrow
			avalon_camera_export_startcol         => CONNECTED_TO_avalon_camera_export_startcol,         --                       .startcol
			avalon_camera_export_colmode          => CONNECTED_TO_avalon_camera_export_colmode,          --                       .colmode
			avalon_camera_export_exposure         => CONNECTED_TO_avalon_camera_export_exposure,         --                       .exposure
			avalon_camera_export_rowsize          => CONNECTED_TO_avalon_camera_export_rowsize,          --                       .rowsize
			avalon_camera_export_colsize          => CONNECTED_TO_avalon_camera_export_colsize,          --                       .colsize
			avalon_camera_export_rowmode          => CONNECTED_TO_avalon_camera_export_rowmode,          --                       .rowmode
			avalon_camera_export_soft_reset_n     => CONNECTED_TO_avalon_camera_export_soft_reset_n,     --                       .soft_reset_n
			avalon_camera_export_width            => CONNECTED_TO_avalon_camera_export_width,            --                       .width
			avalon_camera_export_h_blanking       => CONNECTED_TO_avalon_camera_export_h_blanking,       --                       .h_blanking
			avalon_camera_export_v_blanking       => CONNECTED_TO_avalon_camera_export_v_blanking,       --                       .v_blanking
			avalon_camera_export_red_gain         => CONNECTED_TO_avalon_camera_export_red_gain,         --                       .red_gain
			avalon_camera_export_blue_gain        => CONNECTED_TO_avalon_camera_export_blue_gain,        --                       .blue_gain
			avalon_camera_export_green1_gain      => CONNECTED_TO_avalon_camera_export_green1_gain,      --                       .green1_gain
			avalon_camera_export_green2_gain      => CONNECTED_TO_avalon_camera_export_green2_gain,      --                       .green2_gain
			ccd_pixel_clock_bridge_clk            => CONNECTED_TO_ccd_pixel_clock_bridge_clk,            -- ccd_pixel_clock_bridge.clk
			clk_50_clk                            => CONNECTED_TO_clk_50_clk,                            --                 clk_50.clk
			h2f_reset_reset_n                     => CONNECTED_TO_h2f_reset_reset_n,                     --              h2f_reset.reset_n
			hps_0_hps_io_hps_io_emac1_inst_TX_CLK => CONNECTED_TO_hps_0_hps_io_hps_io_emac1_inst_TX_CLK, --           hps_0_hps_io.hps_io_emac1_inst_TX_CLK
			hps_0_hps_io_hps_io_emac1_inst_TXD0   => CONNECTED_TO_hps_0_hps_io_hps_io_emac1_inst_TXD0,   --                       .hps_io_emac1_inst_TXD0
			hps_0_hps_io_hps_io_emac1_inst_TXD1   => CONNECTED_TO_hps_0_hps_io_hps_io_emac1_inst_TXD1,   --                       .hps_io_emac1_inst_TXD1
			hps_0_hps_io_hps_io_emac1_inst_TXD2   => CONNECTED_TO_hps_0_hps_io_hps_io_emac1_inst_TXD2,   --                       .hps_io_emac1_inst_TXD2
			hps_0_hps_io_hps_io_emac1_inst_TXD3   => CONNECTED_TO_hps_0_hps_io_hps_io_emac1_inst_TXD3,   --                       .hps_io_emac1_inst_TXD3
			hps_0_hps_io_hps_io_emac1_inst_RXD0   => CONNECTED_TO_hps_0_hps_io_hps_io_emac1_inst_RXD0,   --                       .hps_io_emac1_inst_RXD0
			hps_0_hps_io_hps_io_emac1_inst_MDIO   => CONNECTED_TO_hps_0_hps_io_hps_io_emac1_inst_MDIO,   --                       .hps_io_emac1_inst_MDIO
			hps_0_hps_io_hps_io_emac1_inst_MDC    => CONNECTED_TO_hps_0_hps_io_hps_io_emac1_inst_MDC,    --                       .hps_io_emac1_inst_MDC
			hps_0_hps_io_hps_io_emac1_inst_RX_CTL => CONNECTED_TO_hps_0_hps_io_hps_io_emac1_inst_RX_CTL, --                       .hps_io_emac1_inst_RX_CTL
			hps_0_hps_io_hps_io_emac1_inst_TX_CTL => CONNECTED_TO_hps_0_hps_io_hps_io_emac1_inst_TX_CTL, --                       .hps_io_emac1_inst_TX_CTL
			hps_0_hps_io_hps_io_emac1_inst_RX_CLK => CONNECTED_TO_hps_0_hps_io_hps_io_emac1_inst_RX_CLK, --                       .hps_io_emac1_inst_RX_CLK
			hps_0_hps_io_hps_io_emac1_inst_RXD1   => CONNECTED_TO_hps_0_hps_io_hps_io_emac1_inst_RXD1,   --                       .hps_io_emac1_inst_RXD1
			hps_0_hps_io_hps_io_emac1_inst_RXD2   => CONNECTED_TO_hps_0_hps_io_hps_io_emac1_inst_RXD2,   --                       .hps_io_emac1_inst_RXD2
			hps_0_hps_io_hps_io_emac1_inst_RXD3   => CONNECTED_TO_hps_0_hps_io_hps_io_emac1_inst_RXD3,   --                       .hps_io_emac1_inst_RXD3
			hps_0_hps_io_hps_io_sdio_inst_CMD     => CONNECTED_TO_hps_0_hps_io_hps_io_sdio_inst_CMD,     --                       .hps_io_sdio_inst_CMD
			hps_0_hps_io_hps_io_sdio_inst_D0      => CONNECTED_TO_hps_0_hps_io_hps_io_sdio_inst_D0,      --                       .hps_io_sdio_inst_D0
			hps_0_hps_io_hps_io_sdio_inst_D1      => CONNECTED_TO_hps_0_hps_io_hps_io_sdio_inst_D1,      --                       .hps_io_sdio_inst_D1
			hps_0_hps_io_hps_io_sdio_inst_CLK     => CONNECTED_TO_hps_0_hps_io_hps_io_sdio_inst_CLK,     --                       .hps_io_sdio_inst_CLK
			hps_0_hps_io_hps_io_sdio_inst_D2      => CONNECTED_TO_hps_0_hps_io_hps_io_sdio_inst_D2,      --                       .hps_io_sdio_inst_D2
			hps_0_hps_io_hps_io_sdio_inst_D3      => CONNECTED_TO_hps_0_hps_io_hps_io_sdio_inst_D3,      --                       .hps_io_sdio_inst_D3
			hps_0_hps_io_hps_io_usb1_inst_D0      => CONNECTED_TO_hps_0_hps_io_hps_io_usb1_inst_D0,      --                       .hps_io_usb1_inst_D0
			hps_0_hps_io_hps_io_usb1_inst_D1      => CONNECTED_TO_hps_0_hps_io_hps_io_usb1_inst_D1,      --                       .hps_io_usb1_inst_D1
			hps_0_hps_io_hps_io_usb1_inst_D2      => CONNECTED_TO_hps_0_hps_io_hps_io_usb1_inst_D2,      --                       .hps_io_usb1_inst_D2
			hps_0_hps_io_hps_io_usb1_inst_D3      => CONNECTED_TO_hps_0_hps_io_hps_io_usb1_inst_D3,      --                       .hps_io_usb1_inst_D3
			hps_0_hps_io_hps_io_usb1_inst_D4      => CONNECTED_TO_hps_0_hps_io_hps_io_usb1_inst_D4,      --                       .hps_io_usb1_inst_D4
			hps_0_hps_io_hps_io_usb1_inst_D5      => CONNECTED_TO_hps_0_hps_io_hps_io_usb1_inst_D5,      --                       .hps_io_usb1_inst_D5
			hps_0_hps_io_hps_io_usb1_inst_D6      => CONNECTED_TO_hps_0_hps_io_hps_io_usb1_inst_D6,      --                       .hps_io_usb1_inst_D6
			hps_0_hps_io_hps_io_usb1_inst_D7      => CONNECTED_TO_hps_0_hps_io_hps_io_usb1_inst_D7,      --                       .hps_io_usb1_inst_D7
			hps_0_hps_io_hps_io_usb1_inst_CLK     => CONNECTED_TO_hps_0_hps_io_hps_io_usb1_inst_CLK,     --                       .hps_io_usb1_inst_CLK
			hps_0_hps_io_hps_io_usb1_inst_STP     => CONNECTED_TO_hps_0_hps_io_hps_io_usb1_inst_STP,     --                       .hps_io_usb1_inst_STP
			hps_0_hps_io_hps_io_usb1_inst_DIR     => CONNECTED_TO_hps_0_hps_io_hps_io_usb1_inst_DIR,     --                       .hps_io_usb1_inst_DIR
			hps_0_hps_io_hps_io_usb1_inst_NXT     => CONNECTED_TO_hps_0_hps_io_hps_io_usb1_inst_NXT,     --                       .hps_io_usb1_inst_NXT
			hps_0_hps_io_hps_io_uart0_inst_RX     => CONNECTED_TO_hps_0_hps_io_hps_io_uart0_inst_RX,     --                       .hps_io_uart0_inst_RX
			hps_0_hps_io_hps_io_uart0_inst_TX     => CONNECTED_TO_hps_0_hps_io_hps_io_uart0_inst_TX,     --                       .hps_io_uart0_inst_TX
			hps_0_hps_io_hps_io_i2c0_inst_SDA     => CONNECTED_TO_hps_0_hps_io_hps_io_i2c0_inst_SDA,     --                       .hps_io_i2c0_inst_SDA
			hps_0_hps_io_hps_io_i2c0_inst_SCL     => CONNECTED_TO_hps_0_hps_io_hps_io_i2c0_inst_SCL,     --                       .hps_io_i2c0_inst_SCL
			hps_0_hps_io_hps_io_gpio_inst_GPIO09  => CONNECTED_TO_hps_0_hps_io_hps_io_gpio_inst_GPIO09,  --                       .hps_io_gpio_inst_GPIO09
			hps_0_hps_io_hps_io_gpio_inst_GPIO35  => CONNECTED_TO_hps_0_hps_io_hps_io_gpio_inst_GPIO35,  --                       .hps_io_gpio_inst_GPIO35
			hps_0_hps_io_hps_io_gpio_inst_GPIO40  => CONNECTED_TO_hps_0_hps_io_hps_io_gpio_inst_GPIO40,  --                       .hps_io_gpio_inst_GPIO40
			hps_0_hps_io_hps_io_gpio_inst_GPIO53  => CONNECTED_TO_hps_0_hps_io_hps_io_gpio_inst_GPIO53,  --                       .hps_io_gpio_inst_GPIO53
			hps_0_hps_io_hps_io_gpio_inst_GPIO54  => CONNECTED_TO_hps_0_hps_io_hps_io_gpio_inst_GPIO54,  --                       .hps_io_gpio_inst_GPIO54
			hps_0_hps_io_hps_io_gpio_inst_GPIO61  => CONNECTED_TO_hps_0_hps_io_hps_io_gpio_inst_GPIO61,  --                       .hps_io_gpio_inst_GPIO61
			memory_mem_a                          => CONNECTED_TO_memory_mem_a,                          --                 memory.mem_a
			memory_mem_ba                         => CONNECTED_TO_memory_mem_ba,                         --                       .mem_ba
			memory_mem_ck                         => CONNECTED_TO_memory_mem_ck,                         --                       .mem_ck
			memory_mem_ck_n                       => CONNECTED_TO_memory_mem_ck_n,                       --                       .mem_ck_n
			memory_mem_cke                        => CONNECTED_TO_memory_mem_cke,                        --                       .mem_cke
			memory_mem_cs_n                       => CONNECTED_TO_memory_mem_cs_n,                       --                       .mem_cs_n
			memory_mem_ras_n                      => CONNECTED_TO_memory_mem_ras_n,                      --                       .mem_ras_n
			memory_mem_cas_n                      => CONNECTED_TO_memory_mem_cas_n,                      --                       .mem_cas_n
			memory_mem_we_n                       => CONNECTED_TO_memory_mem_we_n,                       --                       .mem_we_n
			memory_mem_reset_n                    => CONNECTED_TO_memory_mem_reset_n,                    --                       .mem_reset_n
			memory_mem_dq                         => CONNECTED_TO_memory_mem_dq,                         --                       .mem_dq
			memory_mem_dqs                        => CONNECTED_TO_memory_mem_dqs,                        --                       .mem_dqs
			memory_mem_dqs_n                      => CONNECTED_TO_memory_mem_dqs_n,                      --                       .mem_dqs_n
			memory_mem_odt                        => CONNECTED_TO_memory_mem_odt,                        --                       .mem_odt
			memory_mem_dm                         => CONNECTED_TO_memory_mem_dm,                         --                       .mem_dm
			memory_oct_rzqin                      => CONNECTED_TO_memory_oct_rzqin,                      --                       .oct_rzqin
			pll_camera_clks_24_clk                => CONNECTED_TO_pll_camera_clks_24_clk,                --     pll_camera_clks_24.clk
			pll_vga_clks_191_clk                  => CONNECTED_TO_pll_vga_clks_191_clk,                  --       pll_vga_clks_191.clk
			pll_vga_clks_25_clk                   => CONNECTED_TO_pll_vga_clks_25_clk,                   --        pll_vga_clks_25.clk
			rgbgray_img_data_valid                => CONNECTED_TO_rgbgray_img_data_valid,                --            rgbgray_img.data_valid
			rgbgray_img_input_data                => CONNECTED_TO_rgbgray_img_input_data,                --                       .input_data
			rgbgray_img_img_width                 => CONNECTED_TO_rgbgray_img_img_width,                 --                       .img_width
			rgbgray_img_img_height                => CONNECTED_TO_rgbgray_img_img_height,                --                       .img_height
			rgbgray_stream_reset_n_reset_n        => CONNECTED_TO_rgbgray_stream_reset_n_reset_n         -- rgbgray_stream_reset_n.reset_n
		);

