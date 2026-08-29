# JavaScript paths

`active/` contains dependency-free logic used by the current browser entry point and by Node tests.

The older folders (`ai/`, `core/`, `entities/`, `simulation/`, `ui/`) are an unwired modular prototype. They are not loaded by `index.html` and still use contracts that differ from the active game, including an older x/y coordinate model. New gameplay work must target the active path or explicitly migrate one bounded responsibility with tests.
