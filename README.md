/**
 * DEVICE - Lab measuring balance
 *
 * Labforward Co.
 *
 * @author Gonzalo Marín Cuesta
 */
 
# Purpose

This application is conceived to output the results of the measurements of a balance to the user and accept commands from him to the balance, in order to manage it remotely.
## Usage

To start the application run: npm run dev

The application authomatically subscribes to all the topics from the balance and prints the information received on them to the user.

It also accepts 5 commands from the user:

   - "0" + (press Enter): it tells the balance to start recording the measures from that moment on.
   - "1" + (press Enter): it stops the balance from recording measures.
   - "2" + (press Enter): it requests to the balance the average measure of all the previous recorded measures.
   - "3" + (press Enter): it turns on the balance.
   - "4" + (press Enter): it turns off the balance, so no measures will be received until it's turned on again.
# Developing time

The approximated dedicated time to this application was 1.5h. It was conceived as a production ready sample application. It allows many more functionalities to be added to the basic performance that it provides.