import { NgModule } from '@angular/core';

//Pipe
import { SanitizerPipe } from './sanitizer/sanitizer.pipe';
import { ConvertorPipe } from './convertor/convertor.pipe';
import { ShrinkorPipe } from './shrinkor/shrinkor.pipe';
import { MomentPipe } from './moment/moment.pipe';

@NgModule({
    declarations: [
        SanitizerPipe,
        ConvertorPipe,
        ShrinkorPipe,
        MomentPipe
    ],
    imports: [

    ],
    exports: [
        SanitizerPipe,
        ConvertorPipe,
        ShrinkorPipe,
        MomentPipe
    ]
})
export class PipesModule{}