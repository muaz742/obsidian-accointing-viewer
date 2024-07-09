# Account Viewer

Obsidian Plugin that automatically generates accounting tables from Markdown code blocks tagged with the `accounting` alias.

## Installation

**Install inside Plugins on Obsidian:**
_⚠️ Important: This way is not ready, will be soon..._
1. **Open Settings.**
2. **Select Turn on community plugins.** For more information, refer to [Plugin security > Restricted mode](https://help.obsidian.md/Extending+Obsidian/Plugin+security#Restricted%20mode).
3. **Select Browse** to list all available community plugins.
4. **Use the text box** to type **"Account Viewer"** keywords.
5. **Enable "Account Viewer" plugin** from the list of Community plugins under **Settings → Community plugins → Installed plugins.**

You can also browse available plugins in your browser, by heading to [obsidian.md/plugins](https://obsidian.md/plugins).

For more details: [Browse community plugins | Obsidian Help](https://help.obsidian.md/Extending+Obsidian/Community+plugins#Browse+community+plugins)

**Manually Install:**
1. Go to the [Release](https://github.com/muaz742/obsidian-accointing-viewer/releases) page.
2. Download the latest version file: 
	- _account-viewer-X.X.X.zip_
3. Manually install the plugin. 
	* [How to Manually Install an Obsidian Plugin | @BrandonKBoswell | YouTube](https://www.youtube.com/watch?v=ffGfVBLDI_0)
4. **Enable "Account Viewer" plugin** from the list of Community plugins under **Settings → Community plugins → Installed plugins.**

## Usage

Add content in a code block using the `accounting` alias.

### Transaction Record

```accounting
transaction 2014-06-01
	+ "Osborne Consulting, Inc., sold $10,000 of common stock to Cindy Osborne, who was investing cash in the business."
```
_Using without:_
```accounting
transaction 
    + "Osborne Consulting, Inc., sold $10,000 of common stock to Cindy Osborne, who was investing cash in the business." 
```

### Journal Entry

```accounting
entry 2014-06-01
	page "Page 1"
	+ Cash: $10,100.50 : 111
	- Common Stock: $10,100.50 : 311
	desc "Sold stock."
```
_Using only account and amount: without date and post reference:_
```accounting
entry
	+ Cash: $10,100.50
	- Common Stock: $10,100.50
```

### T-Account

```accounting
t-account Account Receivable
	+ Beginnig Balance: $24,000
	+ Credit Sales: $400,000
	- Collection: $85,000
	- Bad Debd Expense: $315,000
	balance
	+ Ending Jan: $24,000
```
_Using only account without balance:_
```accounting
t-account Account Receivable
	+ Beginnig Balance: $24,000
	+ Credit Sales: $400,000
	- Collection: $85,000
	- Bad Debd Expense: $315,000
```

### Combine
Using multiple records in one block:
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

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
