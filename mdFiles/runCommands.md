Run all test in one test suite or test file with three browsers

npx playwright test "index_in_youtube.spec.ts"  ui-headed

npx playwright test "index_in_youtube.spec.ts"  ui-headed project=chromium


hardhat project runs

"run_loc_check_state_of_chain": "npx hardhat test .\\test\\tests_erc20WWeth\\unitTests_erc20WWeth\\localnewtork.WillCreator.test.js --network hardhat --grep \"check_state_of_chain\""


run scripts from package.json
scripts: 
"":""

npm run "scriptname"


## Running tests 
.\tests\playwright_scraping\geoJson_scraping.spec.ts

Running a single test file

npx playwright test landing-page.spec.ts

Run a set of test files

npx playwright test tests/todo-page/ tests/landing-page/
Run files that have landing or login in the file name

npx playwright test landing login

Run the test with the title

npx playwright test -g "add a todo item"

Running tests in headed mode

npx playwright test landing-page.spec.ts --headed

Running tests on a specific project

npx playwright test landing-page.ts --project=chromium

## Debugging all tests:

npx playwright test --debug

Debugging one test file:

npx playwright test example.spec.ts --debug

Debugging a test from the line number where the test(.. is defined:

npx playwright test example.spec.ts:10 --debug
