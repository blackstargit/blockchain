# # GET_TOKENS
cast rpc anvil_impersonateAccount 0x1caF820bCb6CEFc9deCad36f11fAF4024A9bcF0b

cast call 0x6DA08364fbEEe5A2ee8E596F3Db6170B147Cad20 \
"balanceOf(address)(uint256)" 0x1caF820bCb6CEFc9deCad36f11fAF4024A9bcF0b

cast send 0x6DA08364fbEEe5A2ee8E596F3Db6170B147Cad20 --from 0x1caF820bCb6CEFc9deCad36f11fAF4024A9bcF0b   \
"transfer(address,uint256)(bool)"   0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266  3400006   --unlocked

cast call 0x9D6664Ad3bbEf76a2A0DF759DaDBF29D8c8D54E2 \
"balanceOf(address)(uint256)" 0x1caF820bCb6CEFc9deCad36f11fAF4024A9bcF0b

cast send 0x9D6664Ad3bbEf76a2A0DF759DaDBF29D8c8D54E2 --from 0x1caF820bCb6CEFc9deCad36f11fAF4024A9bcF0b   \
"transfer(address,uint256)(bool)"   0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266   45804370128   --unlocked

 cast send 0x6DA08364fbEEe5A2ee8E596F3Db6170B147Cad20 \
 "approve(address,uint256)" 0xBA12222222228d8Ba445958A75a0704d566BF2C8 3400006 \
 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

  cast send 0x9D6664Ad3bbEf76a2A0DF759DaDBF29D8c8D54E2 \
 "approve(address,uint256)" 0xBA12222222228d8Ba445958A75a0704d566BF2C8 45804370128 \
 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
