# Loop through the iterations
for i in {1..1}; do
  echo "Sending transaction #$i"

  # # GXX1/UXXX1 joinPool
  # cast send 0xBA12222222228d8Ba445958a75a0704d566BF2C8 \
  # "joinPool(bytes32,address,address,(address[],uint256[],bytes,bool))" \
  # 0x00eba51a44c235bf4f0d3575d6c99d3d4236f694000000000000000000000182 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 \
  # "([0x6DA08364fbEEe5A2ee8E596F3Db6170B147Cad20,0x9D6664Ad3bbEf76a2A0DF759DaDBF29D8c8D54E2], [1000000000000000000,2000000000000000000], 0x, false)" \
  # --rpc-url http://127.0.0.1:8545 \
  # --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  # --gas-limit 300000

  # echo "Transaction #$i GXX1/UXXX1 JoinPool confirmed!"



  # # GXX1/UXXX1 ExitPool
  # cast send 0xBA12222222228d8Ba445958a75a0704d566BF2C8 \
  # "exitPool(bytes32,address,address,(address[],uint256[],bytes,bool))" \
  # 0x00eba51a44c235bf4f0d3575d6c99d3d4236f694000000000000000000000182 0xB859d90A273BcFF2BC682FBB197065C0762F0Bf1 0xB859d90A273BcFF2BC682FBB197065C0762F0Bf1 \
  # "([0x6DA08364fbEEe5A2ee8E596F3Db6170B147Cad20, 0x9D6664Ad3bbEf76a2A0DF759DaDBF29D8c8D54E2], [1000000000000000000, 2000000000000000000], 0x, false)" \
  # --rpc-url https://sepolia.infura.io/v3/c2277863d49b42909d1a6b452b4d2553 \
  # --private-key 0xf590c752425a39c334ee64d5a96941b3b33bb312ce87820349b6b2fa2a76dabe \
  # --gas-limit 300000

  # echo "Transaction #$i GXX1/UXXX1 ExitPool confirmed!"



  # # WETH-BAL-DAI BatchSwap
  # cast send 0xBA12222222228d8Ba445958a75a0704d566BF2C8 \
  # "batchSwap(uint8,(bytes32,uint8,address,address,uint256,bytes)[],(address,bool,address,bool),int256[],uint256)" \
  # 0 \
  # "[(0x00eba51a44c235bf4f0d3575d6c99d3d4236f694000000000000000000000182, 0, 0xC02aaa39b223FE8D0A0e5C4F27eAD9083C756Cc2, 0xba100000625a3754423978a60c9317c58a424e3D, 1000000000000000000, 0x), (0x00eba51a44c235bf4f0d3575d6c99d3d4236f694000000000000000000000182, 0, 0xba100000625a3754423978a60c9317c58a424e3D, 0x6B175474E89094C44Da98b954EedeAC495271d0F, 1000000000000000000, 0x)]" \
  # "(0xB859d90A273BcFF2BC682FBB197065C0762F0Bf1,false,0xB859d90A273BcFF2BC682FBB197065C0762F0Bf1,false)" \
  # "[-1000000000000000000, 1000000000000000000, 1000000000000000000]" \
  # $(($(date +%s) + 300)) \
  # --rpc-url https://sepolia.infura.io/v3/c2277863d49b42909d1a6b452b4d2553 \
  # --private-key 0xf590c752425a39c334ee64d5a96941b3b33bb312ce87820349b6b2fa2a76dabe \
  # --gas-limit 300000

  # echo "Transaction #$i WETH-BAL-DAI BatchSwap confirmed!"



  # UXXX1/GXX1 swap, kind - 0
  cast send 0xBA12222222228d8Ba445958a75a0704d566BF2C8 \
  "swap((bytes32,uint8,address,address,uint256,bytes),(address,bool,address,bool),uint256,uint256)" \
  "(0x00eba51a44c235bf4f0d3575d6c99d3d4236f694000000000000000000000182,0,0x9D6664Ad3bbEf76a2A0DF759DaDBF29D8c8D54E2,0x6DA08364fbEEe5A2ee8E596F3Db6170B147Cad20,100000000,0x)" \
  "(0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266,false,0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266,false)" \
  0 $(($(date +%s) + 300))  \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 


  echo "Transaction #$i UXXX1/GXX1 KIND 0 confirmed!"



  # # GXX1/UXXX1 swap, kind - 0
  # cast send 0xBA12222222228d8Ba445958a75a0704d566BF2C8 \
  # "swap((bytes32,uint8,address,address,uint256,bytes),(address,bool,address,bool),uint256,uint256)" \
  # "(0x00eba51a44c235bf4f0d3575d6c99d3d4236f694000000000000000000000182,0,0x6DA08364fbEEe5A2ee8E596F3Db6170B147Cad20,0x9D6664Ad3bbEf76a2A0DF759DaDBF29D8c8D54E2,10000,0x)" \
  # "(0xB859d90A273BcFF2BC682FBB197065C0762F0Bf1,false,0xB859d90A273BcFF2BC682FBB197065C0762F0Bf1,false)" \
  # 0 $(($(date +%s) + 300))  \
  # --rpc-url https://sepolia.infura.io/v3/c2277863d49b42909d1a6b452b4d2553 \
  # --private-key 0xf590c752425a39c334ee64d5a96941b3b33bb312ce87820349b6b2fa2a76dabe

  # echo "Transaction #$i GXX1/UXXX1 KIND 0 confirmed!"



  # # UXXX1/GXX1 swap, kind - 1
  # cast send 0xBA12222222228d8Ba445958a75a0704d566BF2C8 \
  # "swap((bytes32,uint8,address,address,uint256,bytes),(address,bool,address,bool),uint256,uint256)" \
  # "(0x00eba51a44c235bf4f0d3575d6c99d3d4236f694000000000000000000000182,1,0x9D6664Ad3bbEf76a2A0DF759DaDBF29D8c8D54E2,0x6DA08364fbEEe5A2ee8E596F3Db6170B147Cad20,1,0x)" \
  # "(0xB859d90A273BcFF2BC682FBB197065C0762F0Bf1,false,0xB859d90A273BcFF2BC682FBB197065C0762F0Bf1,false)" \
  # 0 $(($(date +%s) + 300))  \
  # --rpc-url https://sepolia.infura.io/v3/c2277863d49b42909d1a6b452b4d2553 \
  # --private-key 0xf590c752425a39c334ee64d5a96941b3b33bb312ce87820349b6b2fa2a76dabe

  # echo "Transaction #$i UXXX1/GXX1 KIND 1 confirmed!"



  # # GXX1/UXXX1 swap, kind - 1
  # cast send 0xBA12222222228d8Ba445958a75a0704d566BF2C8 \
  # "swap((bytes32,uint8,address,address,uint256,bytes),(address,bool,address,bool),uint256,uint256)" \
  # "(0x00eba51a44c235bf4f0d3575d6c99d3d4236f694000000000000000000000182,1,0x6DA08364fbEEe5A2ee8E596F3Db6170B147Cad20,0x9D6664Ad3bbEf76a2A0DF759DaDBF29D8c8D54E2,10000000,0x)" \
  # "(0xB859d90A273BcFF2BC682FBB197065C0762F0Bf1,false,0xB859d90A273BcFF2BC682FBB197065C0762F0Bf1,false)" \
  # 0 $(($(date +%s) + 300))  \
  # --rpc-url https://sepolia.infura.io/v3/c2277863d49b42909d1a6b452b4d2553 \
  # --private-key 0xf590c752425a39c334ee64d5a96941b3b33bb312ce87820349b6b2fa2a76dabe

  # echo "Transaction #$i GXX1/UXXX1 KIND 1 confirmed!"
done



  # # --- Approve -> UXXX1 ---
  # cast send 0x9D6664Ad3bbEf76a2A0DF759DaDBF29D8c8D54E2 \
  # "approve(address,uint256)" \
  # 0x1caF820bCb6CEFc9deCad36f11fAF4024A9bcF0b \
  # 10000000000 \
  # --rpc-url https://sepolia.infura.io/v3/c2277863d49b42909d1a6b452b4d2553 \
  # --private-key 0x4c77e4ca383bad8216dea0d671909446169de7aa3529a22596ecfcb9e845214f

  # echo "Approval transaction sent!"



  # # --- Approve -> GXX1 ---
  # cast send 0x6DA08364fbEEe5A2ee8E596F3Db6170B147Cad20 \
  # "approve(address,uint256)" \
  # 0x1caF820bCb6CEFc9deCad36f11fAF4024A9bcF0b \
  # 1000000 \
  # --rpc-url https://sepolia.infura.io/v3/c2277863d49b42909d1a6b452b4d2553 \
  # --private-key 0x4c77e4ca383bad8216dea0d671909446169de7aa3529a22596ecfcb9e845214f

  # echo "Approval transaction sent!"



# # --- Diagnose ---
#  cast run 0x5a21c0a1ba68ec42f03388b55982f285276797ad3a673df78ac447414e26b646 \
# --rpc-url https://sepolia.infura.io/v3/c2277863d49b42909d1a6b452b4d2553


# # # --- impersonate ---
# cast rpc anvil_impersonateAccount 0x1caF820bCb6CEFc9deCad36f11fAF4024A9bcF0b


# cast send 0x6DA08364fbEEe5A2ee8E596F3Db6170B147Cad20 --from 0x1caF820bCb6CEFc9deCad36f11fAF4024A9bcF0b \
#   "transfer(address,uint256)(bool)" \
#   0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 \
#   340000 \
#   --unlocked

#   cast send 0x9D6664Ad3bbEf76a2A0DF759DaDBF29D8c8D54E2 --from 0x1caF820bCb6CEFc9deCad36f11fAF4024A9bcF0b \
#   "transfer(address,uint256)(bool)" \
#   0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 \
#   30000000000 \
#   --unlocked


# cast call 0x6DA08364fbEEe5A2ee8E596F3Db6170B147Cad20 "balanceOf(address)(uint256)" 0x1caF820bCb6CEFc9deCad36f11fAF4024A9bcF0b



