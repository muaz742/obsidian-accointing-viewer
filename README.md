# Account Viewer

Obsidian Plugin that automatically generates accounting tables from Markdown code blocks tagged with the `accounting`
alias.

**Example Code Block:**

````
```accounting
entry
    + Cash: $10,100.50
    - Common Stock: $10,100.50
```
````

**Preview:**

<img width="704" alt="prewiev-journal-entry-2" src="https://github.com/muaz742/obsidian-accointing-viewer/assets/39378729/3baefa86-07a2-4bd2-b910-15bce4932be7">


**For more example:**

_Go to [Usage](README.md#usage) header._

## Installation

You can follow any of the 3 options below to install the plugin.

### Option 1

**If you have Obsidian installed on your device:**

- Follow the Obsidian URL to install the
  plugin: [https://obsidian.md/plugins?id=account-viewer](https://obsidian.md/plugins?id=account-viewer)

### Option 2

**Install inside Plugins on Obsidian:**

1. **Open Settings.**
2. **Select Turn on community plugins.** For more information, refer
   to [Plugin security > Restricted mode](https://help.obsidian.md/Extending+Obsidian/Plugin+security#Restricted%20mode).
3. **Select Browse** to list all available community plugins.
4. **Use the text box** to type **"Account Viewer"** keywords.
5. **Enable "Account Viewer" plugin** from the list of Community plugins under **Settings → Community plugins →
   Installed plugins.**

You can also browse available plugins in your browser, by heading to [obsidian.md/plugins](https://obsidian.md/plugins).

For more
details: [Browse community plugins | Obsidian Help](https://help.obsidian.md/Extending+Obsidian/Community+plugins#Browse+community+plugins)

### Option 3

**Manually Install:**

1. Go to the [Release](https://github.com/muaz742/obsidian-accointing-viewer/releases) page.
2. Download the latest version file:
	- _account-viewer-X.X.X.zip_
3. Manually install the plugin.
	* [How to Manually Install an Obsidian Plugin | @BrandonKBoswell | YouTube](https://www.youtube.com/watch?v=ffGfVBLDI_0)
4. **Enable "Account Viewer" plugin** from the list of Community plugins under
5. **Settings → Community plugins → Installed plugins.**

## Usage

Add content in a code block using the `accounting` alias.

### Transaction Record

**Code Block:**

````
```accounting
transaction 2014-06-01
    + "Osborne Consulting, Inc., sold $10,000 of common stock to Cindy Osborne, who was investing cash in the business."
```
````

**Preview:**

<img width="704" alt="prewiev-transaction-1" src="https://github.com/muaz742/obsidian-accointing-viewer/assets/39378729/fd253537-0f50-4fba-8b9b-d3509747016c">

**Code Block:**

_Using without date:_

````
```accounting
transaction 
    + "Osborne Consulting, Inc., sold $10,000 of common stock to Cindy Osborne, who was investing cash in the business." 
```
````

**Preview:**

<img width="704" alt="prewiev-transaction-2" src="https://github.com/muaz742/obsidian-accointing-viewer/assets/39378729/1680cffd-b423-451a-a56c-f21981a19c69">

### Journal Entry

````
```accounting
entry 2014-06-01
    page "Page 1"
    + Cash: $10,100.50 : 111
    - Common Stock: $10,100.50 : 311
    desc "Sold stock."
```
````

**Preview:**

<img width="704" alt="prewiev-journal-entry-1" src="https://github.com/muaz742/obsidian-accointing-viewer/assets/39378729/5af1388a-d26c-41ee-a47a-090ae2b1f990">

**Code Block:**

_Using only account and amount: without date and post reference:_

````
```accounting
entry
    + Cash: $10,100.50
    - Common Stock: $10,100.50
```
````

**Preview:**

<img width="704" alt="prewiev-journal-entry-2" src="https://github.com/muaz742/obsidian-accointing-viewer/assets/39378729/3baefa86-07a2-4bd2-b910-15bce4932be7">

### T-Account

**Code Block:**

````
```accounting
t-account Account Receivable
    + Beginnig Balance: $24,000
    + Credit Sales: $400,000
    - Collection: $85,000
    - Bad Debd Expense: $315,000
    balance
    + Ending Jan: $24,000
```
````

**Preview:**

<img width="704" alt="prewiev-t-account-1" src="https://github.com/muaz742/obsidian-accointing-viewer/assets/39378729/ac783dbf-f1fc-419c-9c49-6951d7653ced">

**Code Block:**

_Using only account without balance_

````
```accounting
t-account Account Receivable
    + Beginnig Balance: $24,000
    + Credit Sales: $400,000
    - Collection: $85,000
    - Bad Debd Expense: $315,000
```
````

**Preview:**

<img width="704" alt="prewiev-t-account-2" src="https://github.com/muaz742/obsidian-accointing-viewer/assets/39378729/c3e8fd1c-3be1-4b7d-b80c-114880317435">

### Combine

**Code Block:**

_Using multiple records in one block:_

````
```accounting  
transaction 2014-06-01  
    + "Osborne Consulting, Inc., sold $10,000 of common stock to Cindy Osborne, who was investing cash in the business." 

transaction 
    + "Osborne Consulting, Inc., sold $10,000 of common stock to Cindy Osborne, who was investing cash in the business." 

entry 2014-06-01  
    page "Page 1"    
    + Cash: $10,100.50 : 111    
    - Common Stock: $10,100.50 : 311    
    desc "Sold stock."  

entry
    page "Page 1"
    + Cash: $10,100.50 : 111
    - Common Stock: $10,100.50 : 311

t-account Account Receivable  
    + Beginnig Balance: $24,000    
    + Credit Sales: $400,000    
    - Collection: $85,000    
    - Bad Debd Expense: $315,000    
    balance    
    + Ending Jan: $24,000
```
````

**Preview:**

<img width="704" alt="preview-combine" src="https://github.com/muaz742/obsidian-accointing-viewer/assets/39378729/8e354be8-b01b-482b-8d7b-7af63a87d6e9">

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
