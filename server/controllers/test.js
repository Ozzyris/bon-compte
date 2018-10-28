		wallet_model.get_walletdetail_from_id( req.body.wallet_id )
			.then( wallet_detail => {
				for(var i = 0; i <= wallet_detail.member.length - 1; i++){
					if( wallet_detail.member[i].balance >= 0 ){
						creditor.push( wallet_detail.member[i] )
					}else{
						debtor.push( wallet_detail.member[i] )
					}
				}

				debtor.sort(function(a, b) {
					a = a.balance;
					b = b.balance;
					return a<b ? 0 : 1;
				});
				creditor.sort(function(a, b) {
					a = a.balance;
					b = b.balance;
					return a<b ? 1 : 0;
				});

				console.log( debtor, creditor );
			})
		res.status(200).json({message: 'Balance resolved'});



for(var i = 0; i <= debtor.length - 1; i++){
	let sum = debtor[i].balance + creditor[0].balance;
	console.log( sum );

	if( sum > 0 ){
		console.log( 'debtor free' );

		payment_maker( amount, creditor, debtor );
		
		// create a transaction
		// update the creditor credit, debtor debt
		//break


	}else{
		console.log( 'creditor free' );

		// create a transaction
		// update debtor debt
		// delete creditor
		// go to next creditor
	}

}

//addition higest debtor to highest creditor.
	// if the result is positive
		//the deptor debt is paid
	// else the debt is not paid.

//create a transaction of the higest debtor to the higest creditor
//update the remaining balance of the debtor.
	//if the higest debtor is bigger than the higest creditor.
		//create a new transaction of the higest debtor to the second highest creditor

	//else 


// [X] fetch all members balance
// [X] create a debtor array and a spender array
// [X] order array by spending size.

//create an array of payment with creditor, debitor, creation date, amount in usd,
// payments = [
// 	{
// 		amount: 12342,
// 		date: generation_date,
// 		creditor: {
// 			first_name: 'alexandre',
// 			last_name: 'nicol',
// 			avatar: 'alex.jpg'
// 		},
// 		debitor: {
// 			first_name: 'jean marie',
// 			last_name: 'baran',
// 			avatar: 'jm.jpg'
// 		}
// 	}
// ];

//check if the wallet balance is = to 0
//save everthing in the wallet itself
//march the payment.creditor && the payment.debitor to the user_id and create and array with and an array without
// let response = {
// 	your_transaction: {},
// 	other_transaction: {}
// };

//update all transaction in the wallet with a paid status
		//change wallet status is applicable
