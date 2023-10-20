pega.ui.Dash = function (){};
pega.ui.Dash.prototype = {
	removeWidgetFromIcon : function(e,widgetIndex){
        //Manually extract the section to be refreshed
		var $source = $(e.target || e.srcElement);
        var slotIx = $source.attr('data-click');
		var ix = slotIx.indexOf('pySlots(');
		slotIx = slotIx.substring(ix+8);
		ix = slotIx.indexOf(')');
		slotIx = slotIx.substring(0,ix);
        $slot = $('div[base_ref$=".pxUserDashboard.pySlots('+slotIx +')"][node_name="pxUserDashboardSlot"]')
        var slot = $slot.parent().get()[0];
		
		var strUrlSF = SafeURL_createFromURL(pega.u.d.url);
		strUrlSF.put("pyActivity", "pxUserDashboardRemoveWidget");
		strUrlSF.put("Slot", slotIx+"");
		strUrlSF.put("Index", widgetIndex+"");
		var callback = {
			success: function (responseObj) {
				var rightPanel = pega.u.d.getSectionByName("pxUserDashboardPersonalize");
				pega.u.d.reloadSection(rightPanel, "", "", false, false, "", false);

				var section = pega.u.d.getSectionByName("pxUserDashboardSlot","",slot);
				pega.u.d.reloadSection(section, "", "", false, false, "", false);
			},
			failure: function (oResponse) {
			}
		};
		var request = pega.u.d.asyncRequest('POST', strUrlSF, callback);
	},
	applyStyles:function(personalize){
		if(personalize){
			$('.flex.screen-layout > main.screen-layout-region-main-middle').addClass('dashboard-in-personalization');
			$('.two-col-main-sidebar_dashboard_personalization_panel').addClass('two-col-main-sidebar_dashboard_personalization_panel_on')
		}else{
			$('.flex.screen-layout > main.screen-layout-region-main-middle').removeClass('dashboard-in-personalization');
			$('.two-col-main-sidebar_dashboard_personalization_panel').removeClass('two-col-main-sidebar_dashboard_personalization_panel_on')
		}
	},
	dragAndDropProcess : function(source,target,location){
		//Do not send unessecary server requests
        if(source == null || target ==null){return;}
		if(source.slot == target.slot){
			if(source.widget == target.widget){
				//Attempting to drop on self, do nothing
                return;
			}
			var $widgets = $('div[base_ref$=".pxUserDashboard.pySlots('+target.slot +')"][node_name="pxUserDashboardSlot"]').find('div[node_name="pxUserDashboardWidget"]')
			var widgetCount = $widgets.length;
			if(location == "append" && source.widget == widgetCount){
				//Attempting to append last widget, do nothing
				return;
			}
			if(location == "before" && source.widget + 1 == target.widget){
				//Attempting to put source before next widget, do nothing
				return;
			}
			if(location == "after" && source.widget - 1 == target.widget){
				//Attempting to put source after previous widget, do nothing
				return;
			}
		}

		var strUrlSF = SafeURL_createFromURL(pega.u.d.url);
		strUrlSF.put("pyActivity", "pxUserDashboardMoveWidget");
		strUrlSF.put("SourceSlotNumber", source.slot+"");
		strUrlSF.put("SourceWidgetNumber", source.widget+"");
		strUrlSF.put("TargetSlotNumber", target.slot+"");
		strUrlSF.put("TargetWidgetNumber", target.widget+"");
		strUrlSF.put("TargetLocation", location+"");
		var callback = {
			success: function (responseObj) {
				var rightPanel = pega.u.d.getSectionByName("pxUserDashboardPersonalize");
				pega.u.d.reloadSection(rightPanel, "", "", false, false, "", false);

				var section = pega.u.d.getSectionByName("pxUserDashboardContent");
				pega.u.d.reloadSection(section, "", "", false, false, "", false);
			},
			failure: function (oResponse) {
			}
		};
		var request = pega.u.d.asyncRequest('POST', strUrlSF, callback);
	},
	dragAndDropWidgetList:function(slot){
		var _this = this;
		//Widget drag handle
		var $list = $('div[node_name="pxUserDashboardWidgetDisplayPanel"]');
		var $slot = $($list.find('div[base_ref*=".pySlots('+slot+')"]')[0]);
		var $mask = $slot.find('.dashboard-drag-handle')
		var $rows = $slot.find('div[node_name="pzUserDashboardWidgetRow"]')
		var $append = $slot.find('.dashboard-slot-drop-append');
		var $appendList = $list.find('.dashboard-slot-drop-append');
		var $appendBlock = $list.find('.drag-drop-rp > .item-2');
		var $rowsList = $list.find('div[node_name="pzUserDashboardWidgetRow"]')
		$mask.draggable({
			revert:'invalid',
			appendTo: '.layout-noheader-dashboarding_right_panel > .layout-body > .content > div[node_name="pxUserDashboardPersonalize"]',
			containment :'.layout-noheader-dashboarding_right_panel > .layout-body > .content > div[node_name="pxUserDashboardPersonalize"]',
			scroll:true,
			delay: 250,
			distance: 10,
			cursor:'copy',
			start: function( event, ui ) {
				$appendList = $list.find('.dashboard-slot-drop-append');
				$appendBlock = $list.find('.drag-drop-rp > .item-2');
				$rowsList = $list.find('div[node_name="pzUserDashboardWidgetRow"]')
				$appendList.attr('aria-dropeffect','move');
				$rowsList.attr('aria-dropeffect','move');
				$(event.target).attr('aria-grabbed','true');
				$appendBlock.css('display','block');
				$rowsList.addClass('dashboard-widget-drop-valid')
				$(this).parents('div[node_name="pzUserDashboardWidgetRow"]').removeClass('dashboard-widget-drop-valid').addClass('dashboard-widget-drop-invalid').addClass('dashboard-widget-drop-dragging');
			},
			stop: function( event, ui ) {
				$appendList.attr('aria-dropeffect','');
				$rowsList.attr('aria-dropeffect','')
					.removeClass('dashboard-widget-drop-bottom')
					.removeClass('dashboard-widget-drop-top')
					.removeClass('dashboard-widget-drop-invalid')
					.removeClass('dashboard-widget-drop-valid')
					.removeClass('dashboard-widget-drop-dragging');;
				$(event.target).attr('aria-grabbed','false');
				$appendBlock.css('display','none');
			},
			drag: function(event,ui){
				var dropzone = ui.helper.data('dropzone');
				if(dropzone==null){return;}
				if(!dropzone.hasClass('dashboard-slot-drop-append')){
					var target = ui.helper.data('target');
					var hw = ui.helper.height() / 2;
					var top = ui.offset.top - dropzone.offset().top + hw;
					if(top < dropzone.height() / 2){
						target.obj.removeClass('dashboard-widget-drop-bottom')
						target.obj.addClass('dashboard-widget-drop-top')
						ui.helper.data('location','before')
					}else{
						target.obj.removeClass('dashboard-widget-drop-top')
						target.obj.addClass('dashboard-widget-drop-bottom')
						ui.helper.data('location','after')
					}
				}
			},
			cursorAt: {left:0,top:0},
			helper:function(event, ui){ 
				var m = $('<div style="width:1px;border:none;margin 0px;padding 0px;"></div>');
				m.data('source',$(this).data('which'));
				m.data('dropzone',null);
				m.data('location','after');
				return m;
			}
		}).each(
			function(){
				//Extract slot # and Widget # and store it
				var $widget = $($(this).parents('div[base_ref*=".pyWidgets("]')[0])
				var $slot = $($(this).parents('div[base_ref*=".pySlots("]')[0])
				var widget = $widget.attr('base_ref');
				var slot = $slot.attr('base_ref');
				var ix = slot.indexOf('pySlots(')+8;
				slot = slot.substring(ix);
				slot = slot.substring(0,slot.indexOf(")"));
				ix = widget.indexOf('pyWidgets(')+10;
				widget = widget.substring(ix);
				widget = widget.substring(0,widget.indexOf(")"));
				$(this).data('which',{slot:slot,widget:widget,obj:$(this)});			
			}
		).attr('aria-grabbed','false').attr('role','listitem');
		//Individual widget dropzones
		$rows.droppable({
		  drop: function( event, ui ) {
			var target = ui.helper.data('target');
			var source = ui.helper.data('source');
			var location = ui.helper.data('location');
			
			//Clear information & classes on drop
			ui.helper.data('dropzone',null);
			ui.helper.data('target',null);
			ui.helper.data('source',null);
			ui.helper.data('location',null);
			if(target!=null){
				//target.obj.removeClass('dashboard-widget-drop-left')
				//target.obj.removeClass('dashboard-widget-drop-right')
			}
			_this.dragAndDropProcess(source,target,location);
		  },
		  over: function( event, ui ) {
			//Store appropriate information when dragging over
			ui.helper.data('dropzone',$(this));
			ui.helper.data('target',$(this).data('which'));
		  },
		  out: function( event, ui ) {
			//Clear information when dragging out
			var target = ui.helper.data('target');
			ui.helper.data('dropzone',null);
			ui.helper.data('target',null);
			if(target!=null){
				target.obj.removeClass('dashboard-widget-drop-bottom')
				target.obj.removeClass('dashboard-widget-drop-top')
			}
		  }
		}).each(
			function(){
				//Extract slot # and Widget # and store it
				var $widget = $($(this).parents('div[base_ref*=".pyWidgets("]')[0])
				var $slot = $($(this).parents('div[base_ref*=".pySlots("]')[0])
				var widget = $widget.attr('base_ref');
				var slot = $slot.attr('base_ref');
				var ix = slot.indexOf('pySlots(')+8;
				slot = slot.substring(ix);
				slot = slot.substring(0,slot.indexOf(")"));
				ix = widget.indexOf('pyWidgets(')+10;
				widget = widget.substring(ix);
				widget = widget.substring(0,widget.indexOf(")"));
				$(this).data('which',{slot:slot,widget:widget,obj:$(this)});			
			}
		).attr('role','listitem').attr('aria-dropeffect','');
		//Append dropzone
		$append.droppable({
		  drop: function( event, ui ) {
			var target = ui.helper.data('target');
			var source = ui.helper.data('source');
			
			//Clear information & classes on drop
			ui.helper.data('dropzone',null);
			ui.helper.data('target',null);
			ui.helper.data('source',null);
			ui.helper.data('location',null);
			$($(this).parents('.layout-noheader-dashboard_slot_append')[0]).removeClass('dashboard-slot-drop-append-hover');
			
			_this.dragAndDropProcess(source,target,'append');

		  },
		  over: function( event, ui ) {
			//Store appropriate information when dragging over
			ui.helper.data('dropzone',$(this));
			ui.helper.data('target',$(this).data('which'));
			$($(this).parents('.layout-noheader-dashboard_slot_append')[0]).addClass('dashboard-slot-drop-append-hover');
			
		  },
		  out: function( event, ui ) {
			//Clear information when dragging out
			ui.helper.data('dropzone',null);
			ui.helper.data('target',null);
			$($(this).parents('.layout-noheader-dashboard_slot_append')[0]).removeClass('dashboard-slot-drop-append-hover');		
		  }
		}).each(
			function(){
				//Extract slot # and Widget # and store it
				var $slot = $($(this).parents('div[base_ref*=".pySlots("]')[0])
				var slot = $slot.attr('base_ref');
				var ix = slot.indexOf('pySlots(')+8;
				slot = slot.substring(ix);
				slot = slot.substring(0,slot.indexOf(")"));
				$(this).data('which',{slot:slot,widget:-1,obj:$(this)});			
			}
		).attr('role','listitem');
	},
	dragAndDropSlot:function(slot){
		var _this = this;
		//Traverse up to the actual mask
		var $slot = $($('.dashboard-slot-drop-append').parents('div[node_name="pxUserDashboardSlot"][base_ref*=".pySlots('+slot+')"]')[0]);
		var $mask = $($slot.find('.dashboard-slot-drop-append')[0]);
		$mask.data('which',{slot:slot,widget:-1});
		//Init drag/drop logic
		$mask.droppable({
		  drop: function( event, ui ) {
			var target = ui.helper.data('target');
			var source = ui.helper.data('source');
			
			//Clear information & classes on drop
			ui.helper.data('dropzone',null);
			ui.helper.data('target',null);
			ui.helper.data('source',null);
			ui.helper.data('location',null);
			$($(this).parents('.layout-noheader-dashboard_slot_append')[0]).removeClass('dashboard-slot-drop-append-hover');
			
			_this.dragAndDropProcess(source,target,'append');
		  },
		  over: function( event, ui ) {
			//Store appropriate information when dragging over
			ui.helper.data('dropzone',$(this));
			ui.helper.data('target',$(this).data('which'));
			$($(this).parents('.layout-noheader-dashboard_slot_append')[0]).addClass('dashboard-slot-drop-append-hover');
		  },
		  out: function( event, ui ) {
			//Clear information when dragging out
			ui.helper.data('dropzone',null);
			ui.helper.data('target',null);
			$($(this).parents('.layout-noheader-dashboard_slot_append')[0]).removeClass('dashboard-slot-drop-append-hover');
		  }
		}).attr('role','listitem');
	},
	dragAndDropWidget:function(slot,widget){
		var _this = this;
		//Find the link associated with the mask
		var $hiddenIcon  = $('div.dashboard-mask-hidden-icon > div > div > span > a[data-click*=".pySlots('+slot+').pyWidgets('+widget+')"]');
		//Traverse up to the actual mask
		var $mask = $hiddenIcon.parents('div.dashboard-mask-drag-and-drop');
		//Need to apply classes to layout-noheader-dashboard_widget_personalize
        var $slot = $('div[base_ref$=".pxUserDashboard.pySlots('+slot +')"][node_name="pxUserDashboardSlot"]')
		var $widget = $($slot.find('div[base_ref$=".pyWidgets('+widget+')"]')[0]);
		$widget = $($widget.find('div.layout-noheader-dashboard_widget_personalize')[0]);
		$mask.data('which',{slot:slot,widget:widget,obj:$widget});
		//Init drag/drop logic
		$mask.draggable({
			revert:'invalid',
			appendTo: '.two-col-main-sidebar_dashboard_personalization_panel.two-col-main-sidebar > .column-1',
			containment :'.two-col-main-sidebar_dashboard_personalization_panel.two-col-main-sidebar > .column-1',
			scroll:true,
			delay: 250,
			distance: 10,
			cursor:'copy',
			start: function( event, ui ) {
				$('.dashboard-mask-drag-and-drop, .layout-noheader-dashboard_slot_append').attr('aria-dropeffect','move');
				$(event.target).attr('aria-grabbed','true');
				$('.layout-outline-dashboard_slot_personalize > .layout-body > .content > .item-2').css('display','block');
				$('div.dashboard-mask-drag-and-drop').addClass('dashboard-widget-drop-valid');
				$(this).removeClass('dashboard-widget-drop-valid').addClass('dashboard-widget-drop-invalid');
				$('div.layout-noheader-dashboard_widget_personalize').removeClass('dashboard-widget-drop-dragging');
				$widget.addClass('dashboard-widget-drop-dragging');
			},
			stop: function( event, ui ) {
				$('.dashboard-mask-drag-and-drop, .layout-noheader-dashboard_slot_append').attr('aria-dropeffect','');
				$(event.target).attr('aria-grabbed','false');
				$('.layout-outline-dashboard_slot_personalize > .layout-body > .content > .item-2').css('display','none');
				$('.layout-noheader-dashboard_widget_personalize').removeClass('dashboard-widget-drop-left')
				$('.layout-noheader-dashboard_widget_personalize').removeClass('dashboard-widget-drop-right')
				$('.layout-noheader-dashboard_slot_append').removeClass('dashboard-slot-drop-append-hover')
				$(this).removeClass('dashboard-widget-drop-invalid');
				$('div.dashboard-mask-drag-and-drop').removeClass('dashboard-widget-drop-valid');
				$('div.layout-noheader-dashboard_widget_personalize').removeClass('dashboard-widget-drop-dragging');
			},
			drag: function(event,ui){
				var dropzone = ui.helper.data('dropzone');
				if(dropzone==null){return;}
				if(!dropzone.hasClass('dashboard-slot-drop-append')){
					var target = ui.helper.data('target');
					var hw = ui.helper.width() / 2;
					var left = ui.offset.left - dropzone.offset().left + hw;
					if(left < dropzone.width() / 2){
						target.obj.removeClass('dashboard-widget-drop-right')
						target.obj.addClass('dashboard-widget-drop-left')
						ui.helper.data('location','before')
					}else{
						target.obj.removeClass('dashboard-widget-drop-left')
						target.obj.addClass('dashboard-widget-drop-right')
						ui.helper.data('location','after')
					}
				}
			},
			cursorAt: {left:2,top:2},
			helper:function(event, ui){ 
				var m = $('<div style="width:1px;border:none;margin 0px;padding 0px;"></div>');

				m.data('source',$(this).data('which'));
				m.data('dropzone',null);
				m.data('location','after');
				
				return m;
			}
		}).droppable({
		  drop: function( event, ui ) {
			var target = ui.helper.data('target');
			var source = ui.helper.data('source');
			var location = ui.helper.data('location');
			
			//Clear information & classes on drop
			ui.helper.data('dropzone',null);
			ui.helper.data('target',null);
			ui.helper.data('source',null);
			ui.helper.data('location',null);
			if(target!=null){
				target.obj.removeClass('dashboard-widget-drop-left')
				target.obj.removeClass('dashboard-widget-drop-right')
			}
			_this.dragAndDropProcess(source,target,location);
		  },
		  over: function( event, ui ) {
			//Store appropriate information when dragging over
			ui.helper.data('dropzone',$(this));
			ui.helper.data('target',$(this).data('which'));
		  },
		  out: function( event, ui ) {
			//Clear information when dragging out
			var target = ui.helper.data('target');
			ui.helper.data('dropzone',null);
			ui.helper.data('target',null);
			if(target!=null){
				target.obj.removeClass('dashboard-widget-drop-left')
				target.obj.removeClass('dashboard-widget-drop-right')
			}
		  }
		}).attr('aria-grabbed','false').attr('role','listitem');
		$('.layout-outline-dashboard_slot_personalize').attr('role','group');
	}
};
pega.ui.Dashboard = new pega.ui.Dash();