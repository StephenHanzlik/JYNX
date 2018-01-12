import { Component, OnInit, ViewChild } from '@angular/core';
import {SuiModalService, TemplateModalConfig, ModalTemplate} from 'ng2-semantic-ui';

export interface IContext {
    data:string;
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
      @ViewChild('modalTemplate')
      public modalTemplate:ModalTemplate<IContext, string, string>

      constructor(public modalService:SuiModalService) { }

      ngOnInit() {
      }

      public openModal(dynamicContent:string = "Example") {
        const config = new TemplateModalConfig<IContext, string, string>(this.modalTemplate);

        config.closeResult = "closed!";
        config.context = { data: dynamicContent };

        this.modalService
            .open(config)
            .onApprove(result => { /* approve callback */ })
            .onDeny(result => { /* deny callback */});
      }

}
