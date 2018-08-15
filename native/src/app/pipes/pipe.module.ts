import { NgModule } from '@angular/core';

//Pipe
import { SanitizerPipe } from './sanitizer/sanitizer.pipe';
import { TimeAgoPipe } from 'angular2-moment';
import { ConvertorPipe } from './convertor/convertor.pipe';

@NgModule({
    declarations: [
        SanitizerPipe,
        TimeAgoPipe,
        ConvertorPipe
    ],
    imports: [

    ],
    exports: [
        SanitizerPipe,
        TimeAgoPipe,
        ConvertorPipe
    ]
})
export class PipesModule{}