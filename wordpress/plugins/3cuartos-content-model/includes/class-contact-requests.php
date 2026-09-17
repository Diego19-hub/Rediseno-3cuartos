<?php
declare(strict_types=1);
namespace ThreeCuartos\ContentModel;
use WP_REST_Request;
use WP_REST_Response;
use WP_Error;
final class ContactRequests {
 public static function register(): void {
  register_post_type('3c_contact_request', array('labels'=>array('name'=>'Solicitudes de contacto','singular_name'=>'Solicitud de contacto'),'public'=>false,'publicly_queryable'=>false,'exclude_from_search'=>true,'show_ui'=>true,'show_in_menu'=>true,'show_in_rest'=>false,'has_archive'=>false,'rewrite'=>false,'supports'=>array('title'),'capability_type'=>'post','map_meta_cap'=>true));
  add_action('add_meta_boxes', array(self::class,'meta_box'));
  add_action('rest_api_init', array(self::class,'route'));
 }
 public static function meta_box(): void { add_meta_box('3cuartos-contact-details','Datos de la solicitud',array(self::class,'render_meta'),'3c_contact_request','normal','high'); }
 public static function render_meta(WP_Post $post): void { $keys=array('name'=>'Nombre','company'=>'Empresa','email'=>'Correo','phone'=>'Teléfono','service'=>'Servicio','budget'=>'Presupuesto','timeline'=>'Plazo','message'=>'Mensaje','received_at'=>'Recibida','status'=>'Estado'); echo '<dl>'; foreach($keys as $key=>$label){$value=get_post_meta($post->ID,'3cuartos_contact_'.$key,true); echo '<dt><strong>'.esc_html($label).'</strong></dt><dd>'.nl2br(esc_html((string)$value)).'</dd>'; } echo '</dl>'; }
 public static function route(): void { register_rest_route('3cuartos/v1','/contact',array('methods'=>'POST','callback'=>array(self::class,'submit'),'permission_callback'=>array(self::class,'can_submit'))); }
 public static function can_submit(): bool { return current_user_can('edit_others_posts'); }
 public static function submit(WP_REST_Request $request): WP_REST_Response|WP_Error {
  if(!self::can_submit()) return new WP_Error('forbidden','No autorizado',array('status'=>403));
  $input=$request->get_json_params(); if(!is_array($input)) return new WP_Error('invalid_payload','Solicitud inválida',array('status'=>400));
  $allowed=array('name','company','email','phone','service','budget','timeline','message','consent','honeypot'); if(array_diff(array_keys($input),$allowed)) return new WP_Error('invalid_fields','Campos no permitidos',array('status'=>400));
  $required=array('name','email','service','message'); $values=array(); foreach($allowed as $key){$values[$key]=is_string($input[$key]??null)?trim($input[$key]):($input[$key]??'');}
  foreach($required as $key){if($values[$key]==='') return new WP_Error('required_field','Campos obligatorios incompletos',array('status'=>400));}
  if(!is_email((string)$values['email'])||strlen((string)$values['email'])>254) return new WP_Error('invalid_email','Correo inválido',array('status'=>400));
  if($values['honeypot']!=='') return new WP_Error('spam_rejected','Solicitud rechazada',array('status'=>400));
  if(!in_array($values['consent'],array(true,1,'1'),true)) return new WP_Error('consent_required','Consentimiento requerido',array('status'=>400));
  $limits=array('name'=>120,'company'=>120,'phone'=>40,'service'=>120,'budget'=>120,'timeline'=>120,'message'=>5000); foreach($limits as $key=>$limit){if(strlen((string)$values[$key])>$limit)return new WP_Error('field_too_long','Campo demasiado largo',array('status'=>400));}
  $post_id=wp_insert_post(array('post_type'=>'3c_contact_request','post_status'=>'private','post_title'=>'Solicitud de contacto — '.gmdate('Y-m-d H:i:s'),'post_date_gmt'=>current_time('mysql',true)),true); if(is_wp_error($post_id)) return new WP_Error('storage_failed','No se pudo almacenar la solicitud',array('status'=>500));
  foreach($limits as $key=>$limit){update_post_meta($post_id,'3cuartos_contact_'.$key,$key==='message'?sanitize_textarea_field((string)$values[$key]):sanitize_text_field((string)$values[$key]));} update_post_meta($post_id,'3cuartos_contact_received_at',current_time('mysql',true)); update_post_meta($post_id,'3cuartos_contact_status','new');
  return new WP_REST_Response(array('success'=>true,'id'=>(int)$post_id),201);
 }
}
